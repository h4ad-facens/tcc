export const environment = {
  production: true,
  imageBaseUrl: 'https://cloudflare-ipfs.com/ipfs/bafybeicvymlc5hzi6jvcavypsp3uzeuej4pyhp75gnk4ab4ewhnfsgqun4',
  keys: {
    proposal: 'create-proposal',
  },
  ethers: {
    network: {
      chainId: `0x${ (80001).toString(16) }`,
      chainName: 'Freedapp Polygon Mainnet',
      rpcUrls: ['https://polygon-mumbai.g.alchemy.com/v2/K9dtIPXgjlvWMoxit__75VmL83q1l0Ng'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com'],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
    },
    explorer: {
      contract: `/token/{contractAddress}`,
      token: `/token/{contractAddress}?a={tokenId}`,
      verify: '',
    },
    metadataUrl: 'https://cloudflare-ipfs.com/ipfs/{tokenURI}',
    contractAddress: {
      proposal: '0x0672C724765Ca66BB9325881A7ACA1dfB3854137',
      bids: '0xEEa3e8974C2f631D4E0351F5f30997fD311633C0',
      dispute: '0x84262946Bc86229D12D0F17C5F60726E760Ef3Ff',
    },
    freeRpcEndpoint: 'https://rpc-mumbai.maticvigil.com',
  },

};
