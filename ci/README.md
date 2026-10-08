# Open-source CI

This repository uses [Woodpecker CI](https://woodpecker-ci.org/) through `.woodpecker.yml`.

## What it validates

- The exported `.skill` archive checksum and ZIP integrity.
- Required skill files and the bundled automation validator.
- n8n, Make, and route-manifest JSON syntax.
- n8n connection targets and the `at-most-once` delivery marker.
- TypeScript, lint, and production build quality.

The validation pipeline requires no application provider secrets. Configure Woodpecker to run `.woodpecker.yml` for pull requests and pushes. Production imports or deployments should be a separate protected pipeline with explicit approval.

For a portable self-hosted deployment, see `ci/woodpecker/README.md` and `ci/woodpecker/docker-compose.yml`. The Compose kit keeps server state in a named volume and expects OAuth and agent secrets through an untracked `.env` file.

When updating `ci/skills/production-funnel-automation.skill`, regenerate its checksum file:

```bash
sha256sum ci/skills/production-funnel-automation.skill > ci/skills/production-funnel-automation.skill.sha256
```
