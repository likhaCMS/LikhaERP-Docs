# AI Agent Skill

Likha ERP ships a native **agent skill** — a `SKILL.md` file that teaches AI coding agents (Devin, Cursor, Claude Code, Windsurf, and any agent that reads skills or rules files) the platform's API conventions, pitfalls, and recipes before they touch your project.

Agents working without it rediscover every edge case the hard way: blocked write requests, silently dead flows, unresolved relations, and mangled template options. With it installed, an agent arrives already knowing the request-layer quirks, the correct way to build M2M junctions, how to wire chart flows, and how to expose public endpoints safely.

## Get the skill

The skill is served directly from this docs site:

```
https://docs.likhaerp.com/skills/likha-erp-api/SKILL.md
```

```bash
curl -o SKILL.md https://docs.likhaerp.com/skills/likha-erp-api/SKILL.md
```

## Install it

Drop it into your repo wherever your agent reads skills:

```
.devin/skills/likha-erp-api/SKILL.md     # Devin project skill
.agents/skills/likha-erp-api/SKILL.md    # agents-skills convention
```

Or paste its contents into your agent's rules/memory file (`AGENTS.md`, `.windsurfrules`, `.cursor/rules`, etc.).

For a user-level install available across all projects:

```
~/.config/devin/skills/likha-erp-api/SKILL.md
```

## What's inside

The skill is a condensed version of this guides section — the rules agents need at their fingertips:

- **Request layer** — user-agent requirements, URL-encoded filters, 403-vs-404 quirks, async write effects, no dedupe on config endpoints
- **Data model** — audit fields, O2M aliases, M2M `junction_field`, tab groups, singletons, geometry fields
- **Permissions** — `$CURRENT_USER` presets, the multi-tenancy pattern, append-only collections
- **Automation** — event trigger options, `$trigger` shape, `emitEvents` loops, serial numbering, the SQL Query operation
- **Dashboards** — panel discovery, the echarts flow recipe, metric and heatmap option shapes
- **Print templates** — the `print` field, LiquidJS context, letterheads, QR verification
- **Public endpoints** — public webhook flows, the validate→query→respond chain, PII masking

Each page in this guides section expands on one of those bullets — the skill points agents back here for the long-form version.
