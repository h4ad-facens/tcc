import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import { resolve } from 'path';
import './tasks/accounts';
import './tasks/deploy';

dotenvConfig({ path: resolve(__dirname, './.env') });

const polygonMumbaiPrivateKey: string | undefined = process.env.POLYGON_MUMBAI_PRIVATE_KEY;
const polygonMumbaiUrl: string | undefined = process.env.POLYGON_MUMBAI_URL;

const polygonMainnetPrivateKey: string | undefined = process.env.POLYGON_MAINNET_PRIVATE_KEY;
const polygonMainnetUrl: string | undefined = process.env.POLYGON_MAINNET_URL;

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    currency: 'USD',
    enabled: true,
    excludeContracts: [],
    src: './contracts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ...polygonMumbaiPrivateKey && polygonMumbaiUrl && {
      mumbai: {
        url: polygonMumbaiUrl,
        accounts: [polygonMumbaiPrivateKey],
      },
    },
    ...polygonMainnetPrivateKey && polygonMainnetUrl && {
      mainnet: {
        url: polygonMainnetUrl,
        accounts: [polygonMainnetPrivateKey],
      },
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    version: '0.8.15',
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: 'none',
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
  },
};

export default config;

