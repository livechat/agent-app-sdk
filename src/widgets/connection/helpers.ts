/**
 * Domain allowed to communicate via iframe with Agent App SDK.
 */
const ALLOWED_DOMAINS = [
  'livechatinc.com',
  'livechat.com',
  'my.lc:3000',
  'legacy.lc:3001'
];

/**
 * Returns `true`, if origin is allowed to communicate with Agent App SDK.
 * @param {string} origin Origin of `message` event targetting Agent App SDK.
 * @
 */
export function getIsEventOriginAllowed(origin: string): boolean {
  if (!origin) {
    return false;
  }

  try {
    const originURL = new URL(origin);
    const originDomain = originURL.hostname;
    const splitted = originDomain.split('.');
    const domainOnly = splitted.slice(splitted.length - 2).join('.');

    // As .lc domain is registerable we restrict our development environment
    // based on port usage.
    const toBeVerified = originURL.port
      ? `${domainOnly}:${originURL.port}`
      : domainOnly;

    return ALLOWED_DOMAINS.includes(toBeVerified);
  } catch {
    return false;
  }
}
