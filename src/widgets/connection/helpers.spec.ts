import { getIsEventOriginAllowed } from './helpers';

describe('getIsEventOriginAllowed', () => {
  it('returns true for valid domains', () => {
    expect(getIsEventOriginAllowed('https://my.lc:3000/chats')).toBe(true);
    expect(getIsEventOriginAllowed('https://legacy.lc:3001/archives')).toBe(
      true
    );
    expect(
      getIsEventOriginAllowed('https://my.labs.livechatinc.com/agents')
    ).toBe(true);
    expect(
      getIsEventOriginAllowed('https://my.staging.livechatinc.com/customers')
    ).toBe(true);
    expect(
      getIsEventOriginAllowed('https://my.staging.livechatinc.com/customers')
    ).toBe(true);
    expect(getIsEventOriginAllowed('https://my.livechat.com/')).toBe(true);
  });

  it('returns false for invalid domains', () => {
    expect(getIsEventOriginAllowed('https://localhost:3000/chats')).toBe(false);
    expect(getIsEventOriginAllowed('https://my.lp:3000/archives')).toBe(false);
    expect(getIsEventOriginAllowed('https://fakelivechat.com/customers')).toBe(
      false
    );
    expect(getIsEventOriginAllowed('https://google.com')).toBe(false);
  });

  it('returns false for invalid URL', () => {
    expect(getIsEventOriginAllowed('')).toBe(false);
    expect(getIsEventOriginAllowed(null)).toBe(false);
    expect(getIsEventOriginAllowed('Its not a valid URL')).toBe(false);
  });
});
