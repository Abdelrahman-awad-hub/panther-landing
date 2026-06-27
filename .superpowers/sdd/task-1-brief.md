### Task 1: Install package, add env var, extend types

**Files:**
- Modify: `package.json` (via npm install)
- Create/modify: `.env.local`
- Modify: `typings.d.ts`

**Interfaces:**
- Produces: `NEXT_PUBLIC_GTM_ID` env var available at build time; `window.dataLayer` typed globally

- [ ] **Step 1: Install `@next/third-parties`**

```bash
npm install @next/third-parties
```

Expected output: package added to `node_modules`, `package-lock.json` updated.

- [ ] **Step 2: Add GTM ID to `.env.local`**

If `.env.local` does not exist, create it. Add this line:

```
NEXT_PUBLIC_GTM_ID=GTM-637363636
```

- [ ] **Step 3: Add `window.dataLayer` type declaration**

Open `typings.d.ts` (currently contains only `declare module '*.css'`). Add the dataLayer declaration:

```ts
declare module '*.css'

interface Window {
  dataLayer: Record<string, unknown>[]
}
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json typings.d.ts .env.local
git commit -m "chore: install @next/third-parties and add GTM env var"
```

---

