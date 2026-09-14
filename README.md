# Indian Jewellery

Next.js and TypeScript jewellery storefront. All application development lives in
`jewelleryfrontend/`; backend and admin implementation remain out of scope.

## Project documentation

- [Website requirements and setup](requirements/requirements.txt)
- [Global design system](design-system/design-system.md)
- [Typography guide](typography/typography.md)
- [Frontend development and verification](jewelleryfrontend/README.md)

## Run locally

Use Node.js 24 LTS and npm:

```powershell
cd jewelleryfrontend
npm ci
npm run dev
```

Open http://localhost:3000. No backend credentials are needed for this frontend preview.
Run `npm run lint`, `npx tsc --noEmit --incremental false`, and `npm run build` to verify.
See the frontend README for browser checks and production preview instructions.
