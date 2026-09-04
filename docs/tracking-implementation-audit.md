# Panther tracking implementation audit

## Implemented in the application

- One GTM container bootstrap; GA4, Meta Pixel, and TikTok browser tags remain GTM-owned.
- Clean data-layer pushes with a generated `event_id`, ISO `event_time`, page context,
  acquisition identifiers, and no customer name or phone.
- Persistent first-touch and latest-touch attribution across visits: UTM parameters,
  `gclid`, `fbclid`, `ttclid`, landing URL, and referrer.
- GA client/session IDs plus `_fbp` and `_ttp` are stored with a validated lead for
  offline matching.
- `form_view`, one-per-session `lead_form_start`, validation errors, API errors,
  stored lead, and qualified lead events.
- Lead conversion is emitted only after server validation and successful Sheet storage.
- Meta CAPI and TikTok Events API use the same lead ID as the browser event for deduplication.
- Server-side CRM lifecycle endpoint for: contacted, qualified, meeting booked,
  account created, first shipment, activated customer, disqualified, lost, contracted.
- CRM outcomes can be sent to Meta and GA4 Measurement Protocol. Deterministic Meta
  event IDs make Sheet retries idempotent.

## GTM/GA4 work still required after deploying this code

1. Add Data Layer Variables for the new fields: `form_id`, `field_name`,
   `service_type`, `expected_shipments`, `city`, `event_time`, `page_type`,
   `landing_page`, `referrer`, UTM fields, click IDs, `client_id`, and `session_id`.
2. Add a GA4 tag for `form_view`; extend the existing form start/error/lead tags with
   the relevant new parameters. Do not create a second lead conversion trigger.
3. Register only useful reporting fields as GA4 custom dimensions. Never register or
   send phone, brand name, free-text reason, or entered website/social URL.
4. Set `GA4_API_SECRET` in the deployment. `GA4_MEASUREMENT_ID` is already documented.
5. Mark `generate_lead` as the primary key event. Treat `qualified_lead`,
   `first_shipment`, and `activated_customer` as downstream quality milestones.

## External setup not safely inferable from the repository

- Google Ads enhanced/offline conversions require the Ads customer ID, conversion
  action/resource IDs, and an approved upload method or OAuth credentials. Do not upload
  until these are supplied and tested against a secondary conversion action.
- Meta/TikTok access tokens and platform-side dataset permissions must be configured in
  the deployment; they must never be committed or prefixed with `NEXT_PUBLIC_`.
- Lead monetary `value` is intentionally omitted. Sending `0` produced a platform warning,
  and no defensible business value has been approved. Add a numeric value only after the
  business defines one by qualified lead or activated customer.
- A consent banner was not introduced because the current product decision explicitly
  removed it. Legal/privacy review is still required before using advertising cookies in
  jurisdictions or traffic sources where consent is mandatory.

## Release QA

- Test valid, invalid, duplicate-click, refresh, direct, UTM, Meta-click, TikTok-click,
  and Google-click submissions.
- Confirm exactly one browser lead and one deduplicated server copy per platform.
- Confirm first-touch remains fixed while last-touch changes on a later campaign visit.
- Confirm Sheet columns A:AD remain unchanged and AE:AZ contain attribution/client IDs.
- Test every CRM dropdown state and confirm both Meta and GA4 delivery status.
- Validate production with Tag Assistant, GA4 DebugView, Meta Test Events, and TikTok Test Events.
