const metadata = {
  'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.stacculents': {
    contract: 'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.stacculents',
    ipfsUrl: 'ipfs://ipfs/QmNm8SPqjmbrjm1JWmim3z5JRkmaavTEw6trT4pyw2kj8z/$TOKEN_ID.json',
  },
  'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft': {
    contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft',
    ipfsUrl: 'ipfs://QmfEeoHahEqpdC2xDAEGEkzzWc1Ms99FbVz5j79PsDUpSf/{id}',
  },
  'SPJJYJVZ4H7B34GG8D3SSN70WVWDYSHCC9E9ZV4V.bitcoin-toadz': {
    contract: 'SPJJYJVZ4H7B34GG8D3SSN70WVWDYSHCC9E9ZV4V.bitcoin-toadz',
    ipfsUrl: 'ipfs://ipfs/QmRt5hZo26w1VPP5gUTrnkxjef2XbbLETDxXQKVwoU6peB/json/{id}.json',
  },
  'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.wasteland-apes-nft': {
    contract: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.wasteland-apes-nft',
    ipfsUrl: 'ipfs://Qmf1gSoSnQLSgG2NbubUbi8R8cuT8sx8T1ZDqcr7cgiu1X/1.json',
  },
  'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.belles-witches': {
    contract: 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG.belles-witches',
    ipfsUrl: 'ipfs://QmUpfBNUnVUzwhbahvRTrSPrQhFnBv1VVwe9t6csCPCF53/{id}.json',
  },
  'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-robot-component-nft': {
    contract: 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-robot-component-nft',
    ipfsUrl: 'https://api.megapont.com/components/{id}',
  }
}

export function ipfsToIpfsIo(ipfsUrl: string): string {
  return ipfsUrl.replace('ipfs://', 'https://ipfs.io/');
}

function standardiseIpfsUrl(ipfsUrl: string): string {
  const ipfsHttp = ipfsToIpfsIo(ipfsUrl);
  return ipfsHttp.replace('$TOKEN_ID', '{id}').replace('1.json', '{id}.json');
}

function standardise(metadata: any) {
  return Object.keys(metadata).reduce((acc, key) => {
    const item = metadata[key];
    acc[item.contract] = {
      contract: item.contract,
      ipfsUrl: standardiseIpfsUrl(item.ipfsUrl),
    };
    return acc;
  }, {});
}

const metadataStandard = standardise(metadata);

export default function handler(req, res) {
  res.status(200).json(metadataStandard);
}
