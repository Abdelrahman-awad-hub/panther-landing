### Task 5: Placeholder SVG Logo + Logo Component

**Files:**
- Create: `public/logo.svg`
- Create: `components/ui/Logo.tsx`

**Interfaces:**
- Produces: `<Logo locale className? size? />` where `size` is `'sm' | 'md' | 'lg'`

- [ ] **Step 1: Create placeholder SVG logo**

Create `public/logo.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 56" fill="none">
  <path d="M10 28 L24 10 L36 20 L32 28 L36 36 L24 46 Z" fill="#E5001A"/>
  <path d="M32 28 L50 22 L54 28 L50 34 Z" fill="#E5001A" opacity="0.65"/>
  <path d="M38 24 L56 22" stroke="#E5001A" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
  <path d="M38 28 L60 28" stroke="#E5001A" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>
  <path d="M38 32 L56 34" stroke="#E5001A" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
  <text x="68" y="35" font-family="Inter,system-ui,sans-serif" font-size="20" font-weight="800" fill="#0A0A0A" letter-spacing="-0.5">PANTHER</text>
  <text x="68" y="48" font-family="Inter,system-ui,sans-serif" font-size="9.5" font-weight="600" fill="#E5001A" letter-spacing="4">EXPRESS</text>
</svg>
```

- [ ] **Step 2: Create Logo component**

Create `components/ui/Logo.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  locale: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean
}

const sizes = { sm: [120, 34], md: [160, 45], lg: [200, 56] } as const

export function Logo({ locale, className = '', size = 'md', dark = false }: LogoProps) {
  const [w, h] = sizes[size]
  return (
    <Link href={`/${locale}`} className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Panther Express"
        width={w}
        height={h}
        priority
        className={dark ? 'invert' : ''}
      />
    </Link>
  )
}
```

- [ ] **Step 3: Commit logo**

```bash
git add -A
git commit -m "feat: add placeholder SVG logo and Logo component"
```

---

