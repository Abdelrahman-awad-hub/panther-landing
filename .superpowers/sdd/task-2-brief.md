### Task 2: Create `GtmPageview` client component

**Files:**
- Create: `components/gtm-pageview.tsx`

**Interfaces:**
- Consumes: `window.dataLayer` (typed in Task 1), `usePathname` from `next/navigation`
- Produces: `<GtmPageview />` — a renderless client component; imported by Task 3

- [ ] **Step 1: Create the component**

Create `components/gtm-pageview.tsx` with this exact content:

```tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GtmPageview() {
  const pathname = usePathname()

  useEffect(() => {
    window.dataLayer?.push({ event: 'pageview', page: pathname })
  }, [pathname])

  return null
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/gtm-pageview.tsx
git commit -m "feat: add GtmPageview client component for SPA route tracking"
```

---

