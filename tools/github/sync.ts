import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { GitHubInfo, Project } from "../../webapp/model/types";
import {
    GITHUB_API,
    mapGitHubInfo,
    repoKey,
    toDate,
    type GhOrg,
    type GhRepo,
    type GhUser
} from "../../webapp/model/data/liveSources";
import { readContentFile, readFlag, REPO_ROOT, run, writeContentFile } from "../shared/nodeContent";

/** tools/github/config.json: usuario, organizacoes e repositorios ocultos. */
interface SyncConfig {
    user?: string;
    organizations?: string[];
    hiddenRepos?: string[];
}

async function readConfig(): Promise<SyncConfig> {
    try {
        return JSON.parse(
            await readFile(resolve(REPO_ROOT, "tools/github/config.json"), "utf8")
        ) as SyncConfig;
    } catch {
        return {};
    }
}

/**
 * Sincroniza os dados publicos do GitHub.
 *
 * Uso:
 *   npm run sync:github
 *   npm run sync:github -- --user=DaviCastr --token=$GITHUB_TOKEN
 *
 * Faz tres coisas:
 *   1. grava webapp/content/github.json (perfil, ultima sincronizacao, a lista
 *      de repositorios do usuario e das organizacoes e as organizacoes);
 *   2. atualiza estrelas/forks/linguagem dos itens de webapp/content/projects.json
 *      cujo campo "repo" aponte para um repositorio do usuario;
 *   3. mantem `repoCount` igual ao tamanho da lista gravada.
 *
 * Organizacoes e repositorios ocultos vem de tools/github/config.json. A lista
 * de organizacoes e somada as que tiverem participacao PUBLICA (a API publica
 * nao enxerga participacao privada, que e o padrao do GitHub).
 *
 * Sem token usa 60 requisicoes/hora da API publica - suficiente para uso local.
 *
 * O mapeamento do payload fica em `webapp/model/data/liveSources.ts`, o mesmo
 * codigo que o app usa quando busca os repositorios ao vivo no browser.
 */

/** Headers comuns, com autenticacao opcional via --token ou GITHUB_TOKEN. */
function buildHeaders(token: string | undefined): Record<string, string> {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "sap-ui5-portfolio-sync"
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

/** GET com tratamento de erro (o GitHub responde 403 quando estoura a cota). */
async function getJson<T>(url: string, token: string | undefined): Promise<T> {
    const response = await fetch(url, { headers: buildHeaders(token) });
    if (!response.ok) {
        throw new Error(`GitHub respondeu HTTP ${response.status} para ${url}`);
    }
    return (await response.json()) as T;
}

async function main(): Promise<void> {
    const token = readFlag("token") ?? process.env.GITHUB_TOKEN;
    const userArg = readFlag("user");

    const config = await readConfig();
    const current = await readContentFile<GitHubInfo>("github.json", {} as GitHubInfo);
    const user = userArg ?? config.user ?? current.login;
    if (!user) {
        throw new Error("informe o usuario: npm run sync:github -- --user=DaviCastr");
    }

    const [profile, repos] = await Promise.all([
        getJson<GhUser>(`${GITHUB_API}/users/${user}`, token),
        getJson<GhRepo[]>(`${GITHUB_API}/users/${user}/repos?per_page=100&sort=pushed`, token)
    ]);

    // Organizacoes: as da configuracao + as com participacao publica.
    const publicOrgs = await getJson<{ login: string }[]>(`${GITHUB_API}/users/${user}/orgs`, token).catch(
        () => []
    );
    const orgLogins = [
        ...new Map(
            [...(config.organizations ?? []), ...publicOrgs.map((org) => org.login)].map((login) => [
                login.toLowerCase(),
                login
            ])
        ).values()
    ];
    const organizations = await Promise.all(
        orgLogins.map(async (login) => ({
            org: await getJson<GhOrg>(`${GITHUB_API}/orgs/${login}`, token),
            repos: await getJson<GhRepo[]>(
                `${GITHUB_API}/orgs/${login}/repos?per_page=100&sort=pushed`,
                token
            )
        }))
    );

    const github = mapGitHubInfo(profile, repos, undefined, {
        organizations,
        hiddenRepos: config.hiddenRepos
    });
    // O indice usa o payload cru (e nao o `github.repos`, que so tem `pushedAt`
    // em YYYY-MM): o `updatedAt` do projeto precisa do dia, nao so do mes.
    const byKey = new Map(
        repos
            .filter((repo) => !repo.fork && !repo.archived)
            .map((repo) => [repoKey(repo.html_url) as string, repo])
    );
    console.log(
        `${github.repoCount} repositorio(s) listado(s) de ${profile.login}` +
            (organizations.length ? ` e de ${organizations.map(({ org }) => org.login).join(", ")}.` : ".")
    );

    await writeContentFile("github.json", github);

    // Atualiza os projetos que apontam para repos do usuario.
    const projects = await readContentFile<Project[]>("projects.json", []);
    let updated = 0;

    const merged = projects.map((project) => {
        const key = repoKey(project.repo);
        const repo = key ? byKey.get(key) : undefined;
        if (!repo) {
            return project;
        }

        updated += 1;
        return {
            ...project,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language ?? project.language,
            updatedAt: toDate(repo.pushed_at) ?? project.updatedAt
        };
    });

    await writeContentFile("projects.json", merged);

    console.log(
        `gravado webapp/content/github.json: ${github.repoCount} repositorio(s), perfil ${github.profileUrl}`
    );
    console.log(`projetos atualizados: ${updated}/${projects.length}`);
    if (projects.length - updated > 0) {
        console.log("  (os demais nao apontam para repos do usuario - nada a fazer)");
    }
}

void run("sync:github", main);
