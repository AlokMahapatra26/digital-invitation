export interface Bindings {
  DB?: any; // Cloudflare D1Database binding
  BUCKET?: any; // Cloudflare R2Bucket binding
  KV_CACHE?: any; // Cloudflare KVNamespace binding
  ASSETS?: any; // Cloudflare Static Assets fetcher
}

