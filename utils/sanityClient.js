// utils/sanityClient.js
import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'qq0ly4v9', // Find this in sanity.json or sanity.io/manage
  dataset: 'production',        // or 'development', whatever you use
  useCdn: false,                 // `true` for faster, cached response (good for public data)
  apiVersion: '2023-12-01',
  token: 'sko1vtGr6CSaHHusV04emrCoTtP6FKd7wNHTNpEGNqB7u2HrU2Nw8brxIE63zYbGPjhet62Kk91lx2Nzr49xNJTfH78gFBnRkOvMZD02oiQO42vkpO0PEuIrLbmlI8YkyKLwYqMZukVgb8hFOVdy9cNaXimldNLarh7g0XqCCwSAhGyFYgtS'   // use the latest date-based version
})
