export const environment = {
  production: true,
  imageBaseUrl: 'https://cloudflare-ipfs.com/ipfs/bafybeicvymlc5hzi6jvcavypsp3uzeuej4pyhp75gnk4ab4ewhnfsgqun4',
  keys: {
    proposal: 'create-proposal',
  },
  ethers: {
    network: {
      chainId: `0x${ (137).toString(16) }`,
      chainName: 'Freedapp Polygon Mainnet',
      rpcUrls: [],
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
      proposal: '',
      bids: '',
      dispute: '',
    },
    freeRpcEndpoint: 'https://rpc-mumbai.maticvigil.com',
  },

};
