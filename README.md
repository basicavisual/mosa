# MoSA

The Museum of Stolen Artefacts is a bilingual public website and a versioned
collection of source-attributed records about displaced cultural objects.

The website, collection data, editorials and publishable images all live in this
repository. There is no database or separate research application. A deployment
builds one Docker image from the repository using
[`apps/website/Dockerfile`](apps/website/Dockerfile).

Public website: [museumofstolenartefacts.org](https://museumofstolenartefacts.org/).
This is the configured project address, not a live health report.

## Start development

Install [mise](https://mise.jdx.dev/) and Git LFS, then run:

```sh
mise trust
mise install
git lfs install
mise exec -- just install
mise exec -- just website-dev
```

Open <http://localhost:4322/es/> or <http://localhost:4322/en/>. The website
needs no database, Docker or credentials for local development. With mise
active, use `just` directly; otherwise prefix commands with `mise exec --`.

Run `just collection-check` after changing collection records and `just verify`
before committing. Run `just` to list all commands.

## Repository

| Path | Purpose |
| --- | --- |
| `collection/objects/` | One small identity and foregrounding record per object |
| `collection/sources/` | Sources with their attributed claims and image records |
| `collection/editorials/` | Optional authored Markdown publications linked to objects |
| `collection/images/` | Publishable image files stored through Git LFS |
| `apps/website/` | Astro website and collection validation |
| `docs/` | Current guides, decisions and retained competency cases |

Read [collection authoring](docs/collection-publication.md) before adding public
records. [Architecture](docs/architecture.md) explains the reduced model and its
political choices. [Operations](docs/operations.md) covers Docker and Coolify.
