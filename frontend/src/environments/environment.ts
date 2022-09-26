export const environment = {
  production: false,
  imageBaseUrl: 'assets/imgs',
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
      contract: `${ import.meta.env.VITE_EXPLORER_URL }/token/{contractAddress}`,
      token: `${ import.meta.env.VITE_EXPLORER_URL }/token/{contractAddress}?a={tokenId}`,
      verify: import.meta.env.VITE_VERIFY_URL,
    },
    metadataUrl: 'https://cloudflare-ipfs.com/ipfs/{tokenURI}',
    contractAddress: {
      certificate: import.meta.env.VITE_ETHERS_CERTIFICATE_ADDRESS,
      institution: import.meta.env.VITE_ETHERS_INSTITUTION_ADDRESS,
    },
    freeRpcEndpoint: import.meta.env.VITE_FREE_RPC,
  },
};
