// utils/sanityClient.js
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'qq0ly4v9', // Find this in sanity.json or sanity.io/manage
  dataset: 'production',        // or 'development', whatever you use
  useCdn: false,                 // `true` for faster, cached response (good for public data)
  apiVersion: '2023-12-01',
  token: process.env.SANITY_SECRET_TOKEN,   // use the latest date-based version
})
