declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    SHOPIFY_STORE_DOMAIN?: string;
    SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
    SHOPIFY_API_VERSION?: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };
