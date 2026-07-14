export type PublicIntegrationStatus = {
  isShopifyConfigured: boolean;
  isIdxConfigured: boolean;
  isGhlConfigured: boolean;
  message: string;
};

export function getPublicIntegrationStatus(env: NodeJS.ProcessEnv = process.env): PublicIntegrationStatus {
  const isShopifyConfigured = Boolean(env.SHOPIFY_STORE_DOMAIN && env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  const isIdxConfigured = Boolean(env.IDX_PROVIDER_BASE_URL && env.IDX_PROVIDER_API_KEY);
  const isGhlConfigured = Boolean(env.GHL_LOCATION_ID && env.GHL_PRIVATE_API_KEY);

  if (!isShopifyConfigured || !isIdxConfigured || !isGhlConfigured) {
    return {
      isShopifyConfigured,
      isIdxConfigured,
      isGhlConfigured,
      message:
        'Some provider connections are not configured yet. Educational content remains available, and provider-backed features must show honest unavailable states until approved credentials are connected.'
    };
  }

  return {
    isShopifyConfigured,
    isIdxConfigured,
    isGhlConfigured,
    message: 'Provider connections are configured for server-side use.'
  };
}
