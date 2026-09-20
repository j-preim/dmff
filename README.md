# Digital Mass Fantasy Faceoff

A Next.js site for tracking two ESPN Fantasy Football leagues during the 2026 season, then featuring the two league champions in the Digital Mass Fantasy Faceoff.

## Configured leagues

- `2113121559`
- `241743`
- Season: `2026`

## Pages

- `/` — Home, league leaders, road to the Faceoff, combined power snapshot
- `/power-rankings` — combined cross-league power rankings
- `/standings` — both ESPN league standings
- `/rosters` — all team rosters
- `/api/espn/sync` — normalized server-side ESPN data response for debugging/integration

## ESPN private-league access

While the leagues remain private, ESPN requests need your authenticated `SWID` and `espn_s2` cookie values. Keep both values on the server. Do not expose them to client-side JavaScript or commit them to git.

Copy `.env.example` to `.env.local` and fill in:

```bash
ESPN_SEASON=2026
ESPN_LEAGUE_1_ID=2113121559
ESPN_LEAGUE_2_ID=241743
ESPN_SWID=...
ESPN_S2=...
ESPN_DEMO_MODE=false
```

For a visual preview without ESPN access, set `ESPN_DEMO_MODE=true`. Demo teams are deliberately generic placeholders and are not intended as real league data.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Power ranking formula (v1)

The initial combined Power Index is intentionally simple and transparent:

- 65% winning percentage
- 35% points scored relative to the highest-scoring team in the combined field

This can be replaced with a custom editorial formula later.

## Champion detection

The site looks for ESPN's final calculated rank (`rankCalculatedFinal === 1`) to identify each league champion. When both are available, the Home page automatically fills both sides of the championship Faceoff card.

## Visual system

The UI is based on the Digital Mass palette and the 16-bit Fantasy Faceoff artwork. Orbitron is used for display text and Urbanist for body/table text via web font loading. No font files are bundled in this project.
