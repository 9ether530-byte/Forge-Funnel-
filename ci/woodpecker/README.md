# Self-hosted Woodpecker CI

This is a portable Docker Compose baseline for the open-source Woodpecker server and one Docker agent. The current GitHub activation target is `9ether530-byte/forge-ai-test-repo`.

## Before starting

1. Choose a persistent Linux host with Docker Engine and Compose v2.
2. Put the host behind HTTPS at the exact `WOODPECKER_HOST` URL.
3. Register an OAuth application with GitHub. Use the callback URL:

```text
https://ci.example.com/authorize
```

4. Copy `.env.example` to `.env` and fill the OAuth values and a random `WOODPECKER_AGENT_SECRET`.
5. Keep `.env` outside Git; it contains credentials.

## Start

```bash
cd ci/woodpecker
cp .env.example .env
$EDITOR .env
docker compose config
docker compose pull
docker compose up -d
```

Open `WOODPECKER_HOST`, sign in through GitHub, activate `9ether530-byte/forge-ai-test-repo`, and keep that repository's `.woodpecker.yml` enabled. If the pipeline is intended for a different repository, replace the activation target rather than changing the Compose file.

## Persistence and security

- `woodpecker-server-data` contains the server database and must be backed up.
- `woodpecker-agent-config` persists agent configuration.
- The agent mounts `/var/run/docker.sock`, which gives pipeline jobs control of the host Docker daemon. Use a dedicated CI host, restrict repository activation, and do not run untrusted pull-request pipelines with production secrets.
- Keep `WOODPECKER_OPEN=false` and explicitly approve repositories.
- Use Woodpecker repository secrets only in protected release workflows; the validation pipeline needs no provider secrets.
- Add a reverse proxy, TLS, firewall rules, and host backups before production use.

## Forge variants

The Compose file is GitHub-configured by default. For Gitea or Forgejo, follow Woodpecker's official forge configuration and replace the `WOODPECKER_GITHUB_*` settings with that provider's variables. Keep the agent secret shared between server and agent.

## Upgrade and rollback

Pin a tested Woodpecker image tag rather than using `latest`. Upgrade with:

```bash
docker compose pull
docker compose up -d
```

Back up `woodpecker-server-data` before upgrades. Roll back by restoring the previous image tag and database backup according to the Woodpecker release notes.
