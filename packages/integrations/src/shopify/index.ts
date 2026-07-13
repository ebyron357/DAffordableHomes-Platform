export type ShopifyConfig = {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
};

export type ShopifyAvailability =
  | { status: 'configured'; config: ShopifyConfig }
  | { status: 'unavailable'; reason: string };

const STORE_DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

export function getShopifyAvailability(env: NodeJS.ProcessEnv = process.env): ShopifyAvailability {
  const storeDomain = env.SHOPIFY_STORE_DOMAIN?.trim();
  const storefrontAccessToken = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const apiVersion = env.SHOPIFY_API_VERSION?.trim() || '2025-01';

  if (!storeDomain || !storefrontAccessToken) {
    return {
      status: 'unavailable',
      reason: 'Shopify Storefront credentials are not configured. Commerce features must remain unavailable instead of exposing placeholder products.'
    };
  }

  if (!STORE_DOMAIN_PATTERN.test(storeDomain)) {
    return {
      status: 'unavailable',
      reason: 'Shopify store domain must be a valid myshopify.com domain.'
    };
  }

  return {
    status: 'configured',
    config: {
      storeDomain,
      storefrontAccessToken,
      apiVersion
    }
  };
}

export function getShopifyStorefrontEndpoint(config: ShopifyConfig): string {
  return `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`;
}
