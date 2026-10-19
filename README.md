# Professional Portfolio — SAPUI5 + TypeScript

A professional portfolio built with **OpenUI5 (SAPUI5) and TypeScript**, designed to showcase professional experience, technical skills, projects, education, and certifications in a modern, maintainable, and bilingual web application.

The project combines the SAPUI5 application architecture with a data-driven approach, automated integrations, and a reusable content model to keep the presentation independent from the underlying data sources.

## Overview

The portfolio was developed to provide a centralized view of my professional background and technical expertise, with a focus on SAP development, software architecture, and continuous learning.

The application supports Portuguese and English, light and dark themes, dynamically generated PDF resumes, and automated synchronization with GitHub and Credly.

**The core principle is simple: content updates should not require changes to the UI.**

Professional information is maintained in version-controlled JSON files, allowing the portfolio to evolve without modifying its views or controllers whenever new experiences, projects, skills, or certifications are added.

## Key Features

- **Bilingual experience:** Portuguese and English, with language resolution based on URL parameters and browser preferences.
- **Light and dark themes:** a consistent interface with user-selectable appearance.
- **Data-driven architecture:** professional content is managed through structured, validated JSON files.
- **Automated GitHub integration:** synchronizes repository information, programming languages, stars, forks, and update dates.
- **Credly certification synchronization:** imports certification badges and keeps the portfolio content up to date.
- **Dynamic PDF resume:** generates a resume in the selected language, with a dedicated layout for professional information.
- **Configurable navigation:** sections and their display order are controlled through content configuration.
- **Automated deployment:** GitHub Actions validates, builds, and publishes the application to GitHub Pages.
- **Automated quality checks:** TypeScript validation, ESLint, unit tests, and content integrity checks.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| OpenUI5 / SAPUI5 | Application framework and UI components |
| TypeScript | Typed application logic and maintainable code |
| XML Views | Declarative UI composition |
| JSON | Structured portfolio content and configuration |
| Vitest | Unit testing |
| ESLint | Code quality and static analysis |
| jsPDF | PDF resume generation |
| Node.js / tsx | Automation scripts and development tooling |
| GitHub Actions | Continuous integration and deployment |
| GitHub Pages | Static application hosting |
| Credly API endpoints | Certification badge synchronization |

## Architecture and Design Principles

The application follows the **Model-View-Controller (MVC)** pattern used in SAPUI5, with an additional separation of responsibilities inside the model layer.

### Separation of concerns

- **Views:** declare the interface using XML and reusable fragments.
- **Controllers:** coordinate navigation, user interactions, and updates to the view models.
- **Model:** contains data access, validation, localization, formatting, business rules, and derived content.
- **Content sources:** provide the portfolio information through a common data-source abstraction.
- **Automation tools:** synchronize external information, validate content, and generate the PDF resume.

This separation keeps UI components focused on presentation while making the application logic easier to test, maintain, and extend.

### Data-driven content

Each portfolio section is backed by structured JSON content. Adding a project, certification, professional experience, or skill generally requires updating its corresponding data file rather than changing application code.

Content validation helps identify issues before deployment, including duplicate identifiers, invalid periods, and references to missing skills or images.

### Pluggable data sources

The application uses a data-source abstraction to separate content consumption from content retrieval.

The current implementation uses static JSON files, while the architecture provides an extension point for future remote sources, including a potential SAP Cloud Application Programming Model (CAP) backend.

This allows the data-access implementation to evolve while preserving the existing views and controllers.

## Automated Integrations

### GitHub

A dedicated synchronization script retrieves public GitHub information and updates the portfolio's repository metadata. Organization and repository filters allow the displayed projects to be controlled without changing the UI.

### Credly

Certification badges are imported into the portfolio's content files. Manually maintained entries are preserved, and badge images can be referenced remotely or downloaded into the application.

Both integrations run as part of the deployment workflow, with version-controlled JSON content serving as the application's data source.

## PDF Resume

The application generates a professional PDF resume using the same underlying content as the website.

The document supports Portuguese and English and organizes information such as contact details, skills, professional experience, projects, education, and certifications.

PDF generation is available through the website and command-line tooling, keeping the output aligned with the portfolio's content.

## Development and Quality

The project includes a dedicated development workflow and automated checks to help maintain consistency as the application grows.

```bash
npm install
npm start
```

Run the main quality checks with:

```bash
npm run lint
npm run types
npm test
npm run content:check
```

Create a production build with:

```bash
npm run build
```

The project also provides scripts for synchronizing GitHub and Credly data and generating the PDF resume.

## Deployment

The application is published through **GitHub Pages**, with GitHub Actions automating the main deployment steps:

1. Synchronize GitHub repository information and certification badges.
2. Validate portfolio content.
3. Generate the PDF resume.
4. Build the production application.
5. Publish the generated application to GitHub Pages.

The workflow supports automatic execution on pushes to the `main` branch, scheduled updates, and manual execution.

## Future Evolution

The architecture is designed to support incremental improvements without unnecessary coupling between the interface and infrastructure.

Potential extensions include:

- Integrating a CAP backend as a remote content provider.
- Expanding automated data synchronization.
- Adding new portfolio sections through configuration.
- Extending automated tests as new domain rules are introduced.

These are architectural extension points, not claims that all of these capabilities are already implemented.

## Live Portfolio

**Website:** https://davicastr.github.io/

**Source code:** https://github.com/DaviCastr/davicastr.github.io

---

*Built with OpenUI5, TypeScript, and a strong focus on separation of concerns, maintainability, automation, and continuous improvement.*
