# Contributing to Seasonal Lounge

Thank you for helping make Seasonal Lounge more useful, accessible, and calm.

## Before you start

1. Search existing issues and pull requests to avoid duplicate work.
2. Open an issue before large API, dependency, or visual-direction changes.
3. Never commit copyrighted media, credentials, analytics identifiers, or personal data.
4. Keep new effects configurable and usable without a specific application framework.

## Development setup

```bash
git clone https://github.com/harshwardhan1507/seasonal-lounge.git
cd seasonal-lounge
npm install
npm run demo
```

Useful checks:

```bash
npm run check
npm run build
npm run demo:build
npm run pack:dry
```

## Making a change

1. Fork the repository.
2. Create a focused branch such as `feature/new-effect` or `fix/audio-loop`.
3. Add or update TypeScript types when the public API changes.
4. Verify keyboard controls, focus visibility, reduced motion, and mobile layout.
5. Update the README and example for user-visible behavior.
6. Run every check listed above.
7. Open a pull request using the repository template.

## Design principles

- Media belongs to the consuming application, not this package.
- Calm mode must always have a clear exit.
- Audio must begin only after a user gesture.
- Motion should be decorative, efficient, and removable through reduced-motion preferences.
- Sensible defaults should not prevent deep customization.
- Public APIs should stay small and typed.

## Commit and pull-request guidance

- Keep commits understandable and narrowly scoped.
- Describe the problem, the chosen solution, and how you verified it.
- Include screenshots or recordings for visual changes.
- Call out breaking changes clearly.

## Reporting security issues

Please follow [SECURITY.md](./SECURITY.md) instead of opening a public issue for a potential vulnerability.

By participating, you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
