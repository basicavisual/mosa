# Operations

## Local requirements

Use the versions pinned in `mise.toml`. Install Git LFS and run `git lfs
install` once per machine. `just install` installs JavaScript dependencies and
Git hooks.

The site needs no database, object storage account or collection API.

## Docker

`just image` builds the root `Dockerfile`. Git LFS must be hydrated
before the Docker build because `.git` is not in the build context. Astro
generates the whole site in the build stage; the runtime image serves the files
with unprivileged Nginx on port 8080.

Build it directly with:

```sh
docker build --file Dockerfile --tag mosa-website:local .
```

`just preview` is useful for inspecting generated pages, but it does
not apply the production Nginx root redirect, cache headers or custom 404
response. Use the Docker image and `pnpm test:http http://127.0.0.1:8080` for
those.

## Coolify

The website application must use:

- branch `main`;
- commit SHA `HEAD`;
- root `Dockerfile` with the repository root as context;
- exposed port 8080;
- automatic deployments disabled;
- preview deployments disabled;
- Git LFS enabled.

The deployment script checks the application settings, triggers one deployment,
verifies Coolify's job commit and checks both collection routes. Coolify's
deployment history remains the record of which commit is currently live.

GitHub's Website workflow is the production release path. It requires
`COOLIFY_DEPLOY_WEBHOOK` and `COOLIFY_API_TOKEN` secrets plus the
`PRODUCTION_URL` environment variable.

## Recovery

Collection and website releases are the same Git commit. Revert the faulty
commit, run `just verify`, merge the revert and dispatch the Website workflow.
Do not restore an old Docker image as a durable content rollback because its
Git state will be less clear.

Keep the Coolify API token and webhook out of Git. Do not put private research
or unauthorised media in `collection/`.
