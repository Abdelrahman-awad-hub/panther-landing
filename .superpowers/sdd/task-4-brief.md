### Task 4: Push `form_submit` event on lead form success

**Files:**
- Modify: `components/sections/LeadForm.tsx:65-78`

**Interfaces:**
- Consumes: `window.dataLayer` (typed in Task 1)
- Produces: `{ event: 'form_submit', form_name: 'contact' }` pushed to dataLayer on successful API response

- [ ] **Step 1: Add dataLayer push inside `onSubmit`**

Find the `onSubmit` function in `components/sections/LeadForm.tsx` (lines 65–78). The current `try` block is:

```ts
const res = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...values, website_confirm: honeypot, ...attribution }),
})
if (!res.ok) throw new Error()
setStatus('success')
```

Add the dataLayer push immediately after `setStatus('success')`:

```ts
const res = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...values, website_confirm: honeypot, ...attribution }),
})
if (!res.ok) throw new Error()
setStatus('success')
window.dataLayer?.push({ event: 'form_submit', form_name: 'contact' })
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify the event fires manually**

With the dev server running (`npm run dev`), open the lead form at `http://localhost:3000`. Open DevTools → Console. Submit the form with valid data. Then run:

```js
window.dataLayer
```

Expected: array contains an entry `{ event: 'form_submit', form_name: 'contact' }`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/LeadForm.tsx
git commit -m "feat: push form_submit event to dataLayer on lead form success"
```

---

## GTM Dashboard Steps (post-deploy — no code changes)

After deploying, configure the following inside GTM (`tagmanager.google.com`):

### Triggers

| Name | Type | Settings |
|---|---|---|
| All Pages — Load | Page View — Window Loaded | fires on all pages |
| Route Change — Pageview | Custom Event | Event name: `pageview` |
| Lead Form Submit | Custom Event | Event name: `form_submit` |
| All Element Clicks | Click — All Elements | fires on all pages |
| Scroll Depth | Scroll Depth | Percentages: 25, 50, 75, 90 |

### Tags

**Meta Pixel — Base Code** (Custom HTML, trigger: All Pages — Load)

```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '25640573636');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=25640573636&ev=PageView&noscript=1"/>
</noscript>
```

**Meta Pixel — Route PageView** (Custom HTML, trigger: Route Change — Pageview)

```html
<script>
  if (typeof fbq !== 'undefined') { fbq('track', 'PageView'); }
</script>
```

**Meta Pixel — Lead** (Custom HTML, trigger: Lead Form Submit)

```html
<script>
  if (typeof fbq !== 'undefined') { fbq('track', 'Lead'); }
</script>
```

After creating all tags and triggers, click **Submit** in GTM to publish the container.
