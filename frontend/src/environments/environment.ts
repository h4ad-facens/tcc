export const environment = {
  production: false,
  imageBaseUrl: 'assets/imgs',
  keys: {
    proposal: 'create-proposal',
  },
  ethers: {
    network: {
      chainId: `0x${ (31337).toString(16) }`,
      chainName: 'Local Network',
      rpcUrls: ['http://localhost:8545'],
      blockExplorerUrls: ['http://localhost:8545'],
      nativeCurrency: {
        name: 'ETHER',
        symbol: 'ETH',
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
      bids: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      dispute: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    },
    freeRpcEndpoint: 'http://localhost:8545',
  },
};
