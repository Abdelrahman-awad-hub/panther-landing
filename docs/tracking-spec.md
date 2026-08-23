# Panther tracking specification

This file is the source of truth for the website data layer and the GTM
container. Conversion tags must use the application success event and must
never use GTM's native form-submit event.

## Event contract

| Data layer event | When it happens | Required parameters |
|---|---|---|
| `virtual_page_view` | Client-side navigation only; the Google tag owns the initial page view | `page_path`, `page_location`, `page_title`, `language` |
| `cta_click` | A commercial CTA is selected | `cta_name`, `cta_location`, `language` |
| `contact_click` | WhatsApp, email, phone, or social profile is selected | `contact_method`, `contact_location`, `link_url`, `language` |
| `lead_form_start` | First interaction with a seller application form | `form_name`, `form_source`, `language` |
| `lead_form_validation_error` | A submit attempt fails browser validation | `form_name`, `form_source`, `error_fields`, `language` |
| `lead_form_error` | The lead API does not confirm storage | `form_name`, `form_source`, `error_type`, `language` |
| `panther_lead_success` | The API has validated and stored the lead | `lead_id`, `event_id`, `form_name`, `form_source`, `lead_source`, `volume_category`, `language` |
| `consent_update` | The visitor saves an optional tracking choice | `marketing_consent`, `language` |
| `shipment_track_search` | A valid tracking search starts | `language` |
| `shipment_track_result` | A tracking search finishes | `tracking_outcome`, `track_status` when found, `language` |
| `language_switch` | The visitor selects the other language | `language` (destination language) |

Every event also contains `page_path`, `page_location`, and `page_title`.
Customer phone numbers, brand names, entered URLs, and waybill numbers must
never be sent to browser analytics or advertising tags. For consented server
lead matching, only the normalized phone hash and non-sensitive identifiers
listed below may be sent.

## Consent and server-side conversion delivery

- GTM is not loaded until the visitor accepts optional tracking. Rejecting it
  never blocks the website or the lead form.
- A stored lead is sent to Meta CAPI and TikTok Events API only when
  `marketingConsent` is `true`.
- Meta and TikTok receive the same `leadId` as the browser `event_id`, allowing
  the platforms to deduplicate browser and server copies.
- Phone and external ID are normalized and SHA-256 hashed on the server. API
  tokens remain server-only. Brand name, city, social URL and website URL are
  never included in advertising payloads.
- Provider failures do not lose or duplicate the lead. They are logged without
  tokens or submitted customer fields.
- `META_TEST_EVENT_CODE` and `TIKTOK_TEST_EVENT_CODE` are used only in Preview
  or Development. Production ignores them so live conversions cannot be
  routed into platform Test Events accidentally.

## GTM migration

1. Disable GA4 Enhanced Measurement **Form interactions**. The application
   emits validated form lifecycle events, so automatic `form_start` and
   `form_submit` events would be duplicates and can count invalid attempts.
2. Do not attach conversion tags to `gtm.formSubmit`, `form_submit`, button
   clicks, or thank-you UI visibility.
3. Create a Custom Event trigger named `Lead - Stored Successfully` with the
   exact event name `panther_lead_success`.
4. Attach all three lead tags to that trigger only:
   - GA4 event name: `generate_lead`
   - Meta standard event: `Lead`
   - TikTok standard event: `Lead` (the current name replacing `SubmitForm`)
5. Set Meta's Event ID to `{{DLV - event_id}}`. Use the same ID if a server-side
   Conversions API integration is enabled later.
6. Remove the experimental `Block - Invalid Form Submit` exception from the
   conversion tags. It is unnecessary once conversions use the success event.
7. Keep one Google tag, one Meta base pixel, and one TikTok base pixel on all
   pages. Do not initialize the same ID in website code and GTM.
8. The initial page view comes from each base tag. Fire route page views only
   on `virtual_page_view`.

## Data layer variables (Version 2)

Create these variables exactly as written:

- `DLV - event_id` → `event_id`
- `DLV - lead_id` → `lead_id`
- `DLV - form_name` → `form_name`
- `DLV - form_source` → `form_source`
- `DLV - lead_source` → `lead_source`
- `DLV - volume_category` → `volume_category`
- `DLV - language` → `language`
- `DLV - cta_name` → `cta_name`
- `DLV - cta_location` → `cta_location`
- `DLV - contact_method` → `contact_method`
- `DLV - contact_location` → `contact_location`
- `DLV - link_url` → `link_url`
- `DLV - tracking_outcome` → `tracking_outcome`
- `DLV - track_status` → `track_status`
- `DLV - error_type` → `error_type`
- `DLV - error_fields` → `error_fields`
- `DLV - page_path` → `page_path`
- `DLV - page_location` → `page_location`
- `DLV - page_title` → `page_title`
- `DLV - marketing_consent` → `marketing_consent`

## GA4 event mapping

| Trigger event | GA4 event name | Event parameters |
|---|---|---|
| `virtual_page_view` | `page_view` | `page_path`, `page_location`, `page_title`, `language` |
| `cta_click` | `cta_click` | `cta_name`, `cta_location`, `language`, `link_url` |
| `contact_click` | `contact_click` | `contact_method`, `contact_location`, `language`, `link_url` |
| `lead_form_start` | `form_start` | `form_name`, `form_source`, `language` |
| `lead_form_validation_error` | `form_validation_error` | `form_name`, `form_source`, `error_fields`, `language` |
| `lead_form_error` | `form_error` | `form_name`, `form_source`, `error_type`, `language` |
| `panther_lead_success` | `generate_lead` | `lead_id`, `event_id`, `lead_source`, `form_name`, `form_source`, `volume_category`, `language` |
| `shipment_track_search` | `shipment_track_search` | `language` |
| `shipment_track_result` | `shipment_track_result` | `tracking_outcome`, `track_status`, `language` |
| `language_switch` | `language_switch` | `language` |

Mark `generate_lead` as the primary GA4 key event. CTA and form-start events
are diagnostic funnel steps, not primary conversions.

## Lead sheet columns

The append order is A:V:

`submittedAt`, `brandName`, `phone`, `city`, `volumeCategory`, `socialLink`,
`websiteUrl`, `referrerUrl`, `landingUrl`, `utmSource`, `utmMedium`,
`utmCampaign`, `utmTerm`, `utmContent`, `userAgent`, `leadId`, `formSource`,
`locale`, `gclid`, `fbclid`, `ttclid`, `marketingConsent`.

## Release verification

- Invalid form: no `panther_lead_success` and no platform conversion.
- API failure: one `lead_form_error` and no platform conversion.
- Valid form: exactly one `panther_lead_success`; GA4, Meta, and TikTok each
  fire exactly once with the same browser event.
- Refresh after success: no additional lead event.
- Initial load: exactly one page view per platform.
- Client-side route navigation: exactly one additional page view per platform.
- CTA and contact events include the correct location and do not inherit values
  from the previous event.
- Tag Assistant Console has no errors and all tags use the published container
  version intended for release.
- Accept consent with an ad blocker enabled, submit one approved test lead and
  verify that Meta/TikTok Test Events show the server event with the same
  `event_id`. Reject consent and verify that neither server event is sent.
