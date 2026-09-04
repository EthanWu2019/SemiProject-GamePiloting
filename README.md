# SemiProject-GamePiloting

A Next.js single-page game-tracking app: contribute to a live
counter, claim days, trigger celebrations for streaks; admin dialog
to grant or revoke contributions; Beijing-time calendar anchor
so the morning boundary is consistent regardless of where you
log in.

> Originally written as a self-rolled substitute for github-style
> contribution grids: those want a private repo, not a personal
> tracker; this is an admin-friendly web app with a single,
> honest data model.

## Build

```bash
npm install
npx prisma generate    # schema in lib/db.ts
npm run dev
```

Storage is localStorage by default; the included adapter can be
swapped for any KV store by replacing one function.

## Run

```
npm run dev          # http://localhost:3000
npm run build && npm start   # production
```

The home page renders the contribution grid for the current week
with theme-aware rendering and a confetti burst on streak
milestones. Open the admin dialog (top right) to authorise or
revoke contributions.

## Status

- [x] Contribution grid + streak maths
- [x] Admin dialog for granting/revoking contributions
- [x] Persistence layer via localStorage
- [ ] Cross-device sync (requires a backend adapter)

## License

Mit
