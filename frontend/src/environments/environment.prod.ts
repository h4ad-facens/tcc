export const environment = {
  production: true,
  imageBaseUrl: 'https://cloudflare-ipfs.com/ipfs/bafybeicvymlc5hzi6jvcavypsp3uzeuej4pyhp75gnk4ab4ewhnfsgqun4',
  keys: {
    proposal: 'create-proposal',
  },
  ethers: {
    network: {
      chainId: `0x${ (137).toString(16) }`,
      chainName: 'CNFT Polygon Mainnet',
      rpcUrls: ['https://polygon-mainnet.g.alchemy.com/v2/UKL_WfZUEqVgrfSe7-yHpgi-ma-ViuXm'],
      blockExplorerUrls: ['https://polygonscan.com'],
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
      proposal: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    },
    freeRpcEndpoint: '',
  },

};
