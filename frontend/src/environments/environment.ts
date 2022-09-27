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
      contract: `/token/{contractAddress}`,
      token: `/token/{contractAddress}?a={tokenId}`,
      verify: '',
    },
    metadataUrl: 'https://cloudflare-ipfs.com/ipfs/{tokenURI}',
    contractAddress: {
      proposal: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      bids: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
      dispute: '',
    },
    freeRpcEndpoint: '',
  },
};
