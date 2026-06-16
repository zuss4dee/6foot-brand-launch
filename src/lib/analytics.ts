import { shopifyHandleBySlug } from "@/lib/shopify-variants";

const MONORAIL_EDGE = "https://monorail-edge.shopifysvc.com/unstable/produce_batch";
const CUSTOMER_TRACKING_SCHEMA = "custom_storefront_customer_tracking/1.2";
const TREKKIE_SCHEMA = "trekkie_storefront_page_view/1.4";
const PRIVACY_SCRIPT = "https://cdn.shopify.com/shopifycloud/privacy-banner/storefront-banner.js";
const COOKIE_CONSENT_KEY = "6foot_cookies_accepted";
const COOKIE_Y = "_shopify_y";
const COOKIE_S = "_shopify_s";
const HEADLESS_APP_ID = "12875497473";
const ASSET_VERSION = "6foot-headless-1";

type ShopConfig = {
  shopId: string;
  domain: string;
  storefrontId: string;
  token: string;
  checkoutDomain?: string;
  storefrontRootDomain?: string;
};

type BrowserContext = {
  uniqueToken: string;
  visitToken: string;
  url: string;
  path: string;
  search: string;
  referrer: string;
  title: string;
  userAgent: string;
  navigationType: string;
  navigationApi: string;
};

type AnalyticsProduct = {
  productGid: string;
  variantGid?: string;
  title: string;
  variantTitle?: string;
  brand?: string;
  category?: string;
  price: number;
  quantity?: number;
};

export type ShopifyProductEventData = {
  slug: string;
  title: string;
  price: number;
  currency?: string;
  variantGid?: string;
  variantTitle?: string;
  productGid?: string;
  brand?: string;
  category?: string;
};

export type ShopifyAddToCartEventData = ShopifyProductEventData & {
  variantGid: string;
  quantity: number;
};

type MonorailEvent = {
  schema_id: string;
  payload: Record<string, unknown>;
  metadata: { event_created_at_ms: number };
};

declare global {
  interface Window {
    privacyBanner?: {
      loadBanner: (config: Record<string, string>) => Promise<void>;
    };
    Shopify?: {
      customerPrivacy?: {
        analyticsProcessingAllowed: () => boolean;
        marketingAllowed: () => boolean;
        saleOfDataAllowed: () => boolean;
      };
    };
  }
}

let initPromise: Promise<void> | null = null;
let shopConfig: ShopConfig | null = null;
const productGidCache = new Map<string, string>();

function isClient() {
  return typeof window !== "undefined";
}

function buildUUID() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function parseGid(gid?: string | null) {
  if (!gid) return { id: "", resource: null as string | null };
  const match = gid.match(/^gid:\/\/shopify\/([^/]+)\/(.+)$/);
  if (!match) return { id: "", resource: null };
  return { id: match[2], resource: match[1] };
}

function getCookie(name: string) {
  if (!isClient()) return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name: string, value: string, maxAgeDays: number) {
  if (!isClient()) return;
  const maxAge = Math.floor(maxAgeDays * 24 * 60 * 60);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function ensureTrackingCookies() {
  let uniqueToken = getCookie(COOKIE_Y);
  let visitToken = getCookie(COOKIE_S);

  if (!uniqueToken) {
    uniqueToken = buildUUID();
    setCookie(COOKIE_Y, uniqueToken, 365);
  }
  if (!visitToken) {
    visitToken = buildUUID();
    setCookie(COOKIE_S, visitToken, 1);
  }

  return { uniqueToken, visitToken };
}

function getNavigationType(): [string, string] {
  try {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const entry = entries[0];
    if (entry?.type) return [entry.type, "PerformanceNavigationTiming"];
  } catch {
    /* ignore */
  }
  return ["unknown", "unknown"];
}

function getBrowserContext(url?: string): BrowserContext {
  const [navigationType, navigationApi] = getNavigationType();
  const tokens = ensureTrackingCookies();

  if (!isClient()) {
    return {
      ...tokens,
      url: url ?? "",
      path: "",
      search: "",
      referrer: "",
      title: "",
      userAgent: "",
      navigationType,
      navigationApi,
    };
  }

  const href = url ?? window.location.href;
  const parsed = new URL(href, window.location.origin);

  return {
    ...tokens,
    url: href,
    path: parsed.pathname,
    search: parsed.search,
    referrer: document.referrer,
    title: document.title,
    userAgent: navigator.userAgent,
    navigationType,
    navigationApi,
  };
}

function hasUserConsent() {
  if (!isClient()) return false;
  if (localStorage.getItem(COOKIE_CONSENT_KEY) === "true") return true;
  try {
    return window.Shopify?.customerPrivacy?.analyticsProcessingAllowed?.() ?? false;
  } catch {
    return false;
  }
}

function privacyFlags() {
  try {
    const privacy = window.Shopify?.customerPrivacy;
    return {
      analyticsAllowed: privacy?.analyticsProcessingAllowed?.() ?? hasUserConsent(),
      marketingAllowed: privacy?.marketingAllowed?.() ?? false,
      saleOfDataAllowed: privacy?.saleOfDataAllowed?.() ?? false,
    };
  } catch {
    return {
      analyticsAllowed: hasUserConsent(),
      marketingAllowed: false,
      saleOfDataAllowed: false,
    };
  }
}

function readShopEnv(): ShopConfig | null {
  const domain = import.meta.env.SHOPIFY_STORE_DOMAIN as string | undefined;
  const token = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string | undefined;
  if (!domain?.trim() || !token?.trim()) return null;

  return {
    shopId: (import.meta.env.SHOPIFY_SHOP_ID as string | undefined)?.trim() ?? "",
    domain: domain.trim(),
    storefrontId: (import.meta.env.SHOPIFY_STOREFRONT_ID as string | undefined)?.trim() || "0",
    token: token.trim(),
    checkoutDomain: (import.meta.env.SHOPIFY_CHECKOUT_DOMAIN as string | undefined)?.trim(),
    storefrontRootDomain: (import.meta.env.SHOPIFY_STOREFRONT_ROOT_DOMAIN as string | undefined)?.trim(),
  };
}

async function fetchShopId(config: ShopConfig) {
  if (config.shopId) return config.shopId;

  const response = await fetch(`https://${config.domain}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.token,
    },
    body: JSON.stringify({ query: "query { shop { id } }" }),
  });

  if (!response.ok) return "";

  const json = (await response.json()) as { data?: { shop?: { id?: string } } };
  return json.data?.shop?.id ?? "";
}

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function loadPrivacyScript(config: ShopConfig) {
  try {
    await loadScript(PRIVACY_SCRIPT, "shopify-privacy-banner");
    if (!window.privacyBanner?.loadBanner) return;

    const checkoutRootDomain = config.checkoutDomain ?? config.domain;
    const storefrontRootDomain = config.storefrontRootDomain ?? window.location.hostname;

    await window.privacyBanner.loadBanner({
      storefrontAccessToken: config.token,
      checkoutRootDomain,
      storefrontRootDomain,
    });
  } catch (err) {
    console.warn("[analytics] Shopify privacy banner unavailable", err);
  }
}

async function ensureShopConfig() {
  if (shopConfig?.shopId) return shopConfig;

  const envConfig = readShopEnv();
  if (!envConfig) return null;

  const shopId = await fetchShopId(envConfig);
  shopConfig = { ...envConfig, shopId };
  return shopConfig;
}

export function initShopifyAnalytics(): Promise<void> {
  if (!isClient()) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = (async () => {
    ensureTrackingCookies();
    const config = await ensureShopConfig();
    if (config) await loadPrivacyScript(config);
  })().catch((err) => {
    initPromise = null;
    console.warn("[analytics] initialization failed", err);
  });

  return initPromise;
}

async function resolveProductGid(slug: string, productGid?: string) {
  if (productGid) return productGid;
  if (productGidCache.has(slug)) return productGidCache.get(slug)!;

  const config = await ensureShopConfig();
  if (!config) return "";

  const handle = shopifyHandleBySlug[slug] ?? slug;
  const response = await fetch(`https://${config.domain}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.token,
    },
    body: JSON.stringify({
      query: "query ProductId($handle: String!) { product(handle: $handle) { id } }",
      variables: { handle },
    }),
  });

  if (!response.ok) return "";

  const json = (await response.json()) as { data?: { product?: { id?: string } } };
  const gid = json.data?.product?.id ?? "";
  if (gid) productGidCache.set(slug, gid);
  return gid;
}

function formatProductLine(product: AnalyticsProduct) {
  const payload: Record<string, unknown> = {
    product_gid: product.productGid,
    name: product.title,
    variant: product.variantTitle ?? "",
    brand: product.brand ?? "6foot",
    price: product.price,
    quantity: Number(product.quantity ?? 1),
  };

  if (product.variantGid) {
    payload.variant_gid = product.variantGid;
    payload.variant_id = Number.parseInt(parseGid(product.variantGid).id, 10) || 0;
  }

  const productId = Number.parseInt(parseGid(product.productGid).id, 10);
  if (productId) payload.product_id = productId;
  if (product.category) payload.category = product.category;

  return JSON.stringify(payload);
}

function basePayload(config: ShopConfig, browser: BrowserContext) {
  const privacy = privacyFlags();
  const shopNumericId = Number.parseInt(parseGid(config.shopId).id, 10) || 0;

  return {
    source: "headless",
    asset_version_id: ASSET_VERSION,
    hydrogenSubchannelId: config.storefrontId,
    is_persistent_cookie: hasUserConsent(),
    deprecated_visit_token: browser.visitToken,
    unique_token: browser.uniqueToken,
    event_time: Date.now(),
    event_id: buildUUID(),
    event_source_url: browser.url,
    referrer: browser.referrer,
    user_agent: browser.userAgent,
    navigation_type: browser.navigationType,
    navigation_api: browser.navigationApi,
    shop_id: shopNumericId,
    currency: "GBP",
    ccpa_enforced: false,
    gdpr_enforced: false,
    gdpr_enforced_as_string: "false",
    analytics_allowed: privacy.analyticsAllowed,
    marketing_allowed: privacy.marketingAllowed,
    sale_of_data_allowed: privacy.saleOfDataAllowed,
    canonical_url: browser.url,
    customer_id: 0,
  };
}

function wrapEvent(schemaId: string, payload: Record<string, unknown>): MonorailEvent {
  return {
    schema_id: schemaId,
    payload,
    metadata: { event_created_at_ms: Date.now() },
  };
}

async function sendToShopify(events: MonorailEvent[], domain?: string) {
  if (!events.length || !isClient()) return;
  if (/Chrome-Lighthouse/.test(navigator.userAgent)) return;

  const endpoint = domain
    ? `https://${domain}/.well-known/shopify/monorail/unstable/produce_batch`
    : MONORAIL_EDGE;

  const body = JSON.stringify({
    events,
    metadata: { event_sent_at_ms: Date.now() },
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body,
      keepalive: true,
    });

    if (!response.ok) {
      console.warn("[analytics] Shopify monorail request failed", response.status);
      return;
    }

    const text = await response.text();
    if (!text) return;

    const json = JSON.parse(text) as { result?: { status: number; message?: string }[] };
    json.result?.forEach((result) => {
      if (result.status !== 200) {
        console.warn("[analytics] Shopify monorail event rejected", result.message);
      }
    });
  } catch (err) {
    console.warn("[analytics] Shopify monorail transport error", err);
  }
}

function enqueue(send: () => Promise<void>) {
  if (!isClient()) return;
  void initShopifyAnalytics()
    .then(send)
    .catch((err) => console.warn("[analytics] event dispatch failed", err));
}

async function publishCustomerEvent(
  eventName: string,
  browser: BrowserContext,
  extra: Record<string, unknown> = {},
) {
  if (!hasUserConsent()) return;

  const config = await ensureShopConfig();
  if (!config?.shopId) return;

  const payload = {
    ...basePayload(config, browser),
    event_name: eventName,
    ...extra,
  };

  await sendToShopify([wrapEvent(CUSTOMER_TRACKING_SCHEMA, payload)], config.domain);
}

async function publishTrekkiePageView(browser: BrowserContext) {
  if (!hasUserConsent()) return;

  const config = await ensureShopConfig();
  if (!config?.shopId) return;

  const shopNumericId = Number.parseInt(parseGid(config.shopId).id, 10) || 0;

  const payload = {
    appClientId: HEADLESS_APP_ID,
    isMerchantRequest: false,
    hydrogenSubchannelId: config.storefrontId,
    isPersistentCookie: hasUserConsent(),
    uniqToken: browser.uniqueToken,
    visitToken: browser.visitToken,
    microSessionId: buildUUID(),
    microSessionCount: 1,
    url: browser.url,
    path: browser.path,
    search: browser.search,
    referrer: browser.referrer,
    title: browser.title,
    shopId: shopNumericId,
    currency: "GBP",
    contentLanguage: "en",
    pageType: "page",
    customerId: 0,
    resourceType: undefined,
    resourceId: 0,
  };

  await sendToShopify([wrapEvent(TREKKIE_SCHEMA, payload)], config.domain);
}

export function trackPageView(url: string) {
  enqueue(async () => {
    const browser = getBrowserContext(url);
    await Promise.all([
      publishCustomerEvent("page_rendered", browser),
      publishTrekkiePageView(browser),
    ]);
  });
}

export function trackProductView(productData: ShopifyProductEventData) {
  enqueue(async () => {
    const browser = getBrowserContext();
    const productGid = await resolveProductGid(productData.slug, productData.productGid);
    if (!productGid) return;

    const product: AnalyticsProduct = {
      productGid,
      variantGid: productData.variantGid,
      title: productData.title,
      variantTitle: productData.variantTitle,
      brand: productData.brand ?? "6foot",
      category: productData.category,
      price: productData.price,
      quantity: 1,
    };

    await publishCustomerEvent("product_page_rendered", browser, {
      products: [formatProductLine(product)],
      total_value: productData.price,
    });
  });
}

export function trackAddToCart(itemData: ShopifyAddToCartEventData) {
  enqueue(async () => {
    const browser = getBrowserContext();
    const productGid = await resolveProductGid(itemData.slug, itemData.productGid);
    if (!productGid || !itemData.variantGid) return;

    const product: AnalyticsProduct = {
      productGid,
      variantGid: itemData.variantGid,
      title: itemData.title,
      variantTitle: itemData.variantTitle,
      brand: itemData.brand ?? "6foot",
      category: itemData.category,
      price: itemData.price,
      quantity: itemData.quantity,
    };

    await publishCustomerEvent("product_added_to_cart", browser, {
      products: [formatProductLine(product)],
      total_value: itemData.price * itemData.quantity,
      cart_token: null,
    });
  });
}
