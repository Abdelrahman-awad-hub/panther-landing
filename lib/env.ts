export const env = {
  sellerPortalUrl: process.env.NEXT_PUBLIC_SELLER_PORTAL_URL ?? '#',
  panther: {
    apiBaseUrl: process.env.PANTHER_API_BASE_URL || 'https://panther-express.top',
  },
  google: {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    sheetId: process.env.GOOGLE_SHEET_ID ?? '',
  },
} as const
