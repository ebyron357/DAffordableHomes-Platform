declare module 'next' {
  export type Metadata = {
    title?: string | { default: string; template: string };
    description?: string;
    metadataBase?: URL;
    alternates?: { canonical?: string };
    openGraph?: Record<string, unknown>;
  };
}

declare module '*.css';

declare namespace React {
  type ReactNode = unknown;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: Record<string, unknown>;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    SHOPIFY_STORE_DOMAIN?: string;
    SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
    IDX_PROVIDER_BASE_URL?: string;
    IDX_PROVIDER_API_KEY?: string;
    GHL_LOCATION_ID?: string;
    GHL_PRIVATE_API_KEY?: string;
  }
}

declare const process: { env: NodeJS.ProcessEnv };
