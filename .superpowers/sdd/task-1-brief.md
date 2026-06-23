### Task 1: Project Scaffold + Tailwind Brand Config

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `next.config.ts` (placeholder, replaced in Task 2)

**Interfaces:**
- Produces: working Next.js dev server, Tailwind with panther brand colors, all deps installed, shadcn/ui initialized

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/abdelrahmanawad/LandingPage
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --yes
```
Expected output: "Success! Created..." with no errors.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-intl googleapis react-hook-form @hookform/resolvers zod
```

- [ ] **Step 3: Install and initialize shadcn/ui**

```bash
npx shadcn@latest init --yes --defaults
```

- [ ] **Step 4: Add required shadcn components**

```bash
npx shadcn@latest add button input label select form badge card
```

- [ ] **Step 5: Replace tailwind.config.ts with brand theme**

Replace the full contents of `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        panther: {
          red: '#E5001A',
          'red-dark': '#B8001A',
          'red-light': '#FF1A33',
          black: '#0A0A0A',
          dark: '#111111',
          surface: '#1A1A1A',
          gray: '#2A2A2A',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 6: Replace app/globals.css with brand CSS variables**

Replace the full contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 4%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 4%;
    --primary: 352 100% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 10%;
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 352 100% 45%;
    --radius: 0.5rem;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

[dir="rtl"] body {
  font-family: var(--font-cairo), system-ui, sans-serif;
}

[dir="ltr"] body {
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev &
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```
Expected: `200`

```bash
kill %1
```

- [ ] **Step 8: Commit scaffold**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 with Tailwind brand theme and shadcn/ui"
```

---

