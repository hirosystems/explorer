import { imageCanonicalUriFromFtMetadata, isFtNameLikeStx } from '../token-utils';
import { isIconUrl } from '../url-utils';

describe(isFtNameLikeStx.name, () => {
  it('detect impersonating token names', () => {
    expect(isFtNameLikeStx('STX')).toBeTruthy();
    expect(isFtNameLikeStx('stx')).toBeTruthy();
    expect(isFtNameLikeStx('stacks')).toBeTruthy();
    expect(isFtNameLikeStx('Stäcks')).toBeTruthy();
    expect(isFtNameLikeStx('Stácks')).toBeTruthy();
    expect(isFtNameLikeStx('Stáçks')).toBeTruthy();
    expect(isFtNameLikeStx('stocks')).toBeFalsy();
    expect(isFtNameLikeStx('miamicoin')).toBeFalsy();
    expect(isFtNameLikeStx('')).toBeFalsy();
  });
});

describe(isIconUrl.name, () => {
  it('detect valid icon url', () => {
    expect(isIconUrl('https://example.com/icon.png')).toBeTruthy();
    expect(isIconUrl('')).toBeFalsy();
    expect(isIconUrl('https://example.com/icon.png?foo=bar')).toBeTruthy();
  });
});

describe(imageCanonicalUriFromFtMetadata.name, () => {
  it('detect valid ftMetadata', () => {
    const defaultMetadata = {
      token_uri: 'https://x.syvita.org/metadata/wmno8.json',
      name: 'Wrapped Nothing v8',
      description: 'A wrapped version of Nothing from nothingtoken.com',
      image_uri:
        'https://stacks-api.imgix.net/https%3A%2F%2Fx.syvita.org%2Fftimg%2Fwmno_tokenlogo_01_500x500_(official).png?s=2b5ae2fae0fe7d4a720641f82220d295',
      symbol: 'WMNO8',
      decimals: 0,
      tx_id: '0x8200e6ada189dd76dc17e0ad8e3857348bb7e3cda7c2600877f59d60eaafda64',
      sender_address: 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ',
    };

    expect(
      imageCanonicalUriFromFtMetadata({
        ...defaultMetadata,
        ...{
          image_canonical_uri: 'https://example.com/icon.png',
        },
      })
    ).toBeTruthy();

    expect(
      imageCanonicalUriFromFtMetadata({
        ...defaultMetadata,
        ...{
          name: 'Stácks',
          image_canonical_uri: 'https://example.com/icon.png',
        },
      })
    ).toBeFalsy();

    expect(
      imageCanonicalUriFromFtMetadata({
        ...defaultMetadata,
        ...{
          image_canonical_uri: '',
        },
      })
    ).toBeFalsy();
    expect(
      imageCanonicalUriFromFtMetadata({
        ...defaultMetadata,
        ...{
          image_canonical_uri: 'https://example.com/icon.png?foo=bar',
        },
      })
    ).toBeTruthy();
  });
});
