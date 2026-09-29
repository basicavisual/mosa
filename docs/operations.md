# Operations

## Local requirements

Use the versions pinned in `mise.toml`. Install Git LFS and run `git lfs
install` once per machine. `just install` installs JavaScript dependencies and
Git hooks.

The site needs no database, object storage account or collection API.

## Docker

`just website-image` builds `apps/website/Dockerfile` from the repository
root. Git LFS must be hydrated before the Docker build because `.git` is not in
the build context. The image listens on port 8080 and exposes `/build.json` for
commit and collection-count verification.

For an exact local revision marker, build with:

```sh
docker build --build-arg SOURCE_COMMIT="$(git rev-parse HEAD)" \
  --file apps/website/Dockerfile --tag mosa-website:local .
```

## Coolify

The website application must use:

- branch `main`;
- commit SHA `HEAD`;
- Dockerfile `apps/website/Dockerfile` with the repository root as context;
- exposed port 8080;
- automatic deployments disabled;
- preview deployments disabled;
- Git LFS enabled.

Coolify provides `SOURCE_COMMIT` to the running container. The deployment
script checks the application settings, triggers one deployment, verifies the
job commit, reads `/build.json` and checks both collection routes.

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
