//#region Imports

import { Injectable } from "@angular/core";
import { Contract, ContractInterface, ethers } from "ethers";
import Web3Modal from 'web3modal';
import { environment } from "../../../../environments/environment";
import { UseWeb3Store } from "../models/use-web3.interface";
import { CertificateCore } from "../nft/CertificateCore";
import { InstitutionCore } from "../nft/InstitutionCore";
import CertificateCoreAbi from "../nft/CertificateCore.json";
import InstitutionCoreAbi from "../nft/institutionCore.json";
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class Web3Service {

  //#region Public Functions

  public setupDefaultContract(useWeb3: UseWeb3Store): UseWeb3Store['setupDefaultContract'] {
    return function () {
      const freeRpcProvider = new JsonRpcProvider(environment.ethers.freeRpcEndpoint);

      const certificateContract = new ethers.Contract(environment.ethers.contractAddress.certificate, CertificateCoreAbi, freeRpcProvider) as CertificateCore;
      const institutionContract = new ethers.Contract(environment.ethers.contractAddress.institution, InstitutionCoreAbi, freeRpcProvider) as InstitutionCore;

      useWeb3.certificateContract = certificateContract;
      useWeb3.institutionContract = institutionContract;
    };
  }

  public async addNetwork(provider: Web3Provider): Promise<void> {
    if (!environment.ethers.network)
      return;

    console.log(`Conectando com a rede: ${environment.ethers.network.chainName}`);

    await provider.send('wallet_addEthereumChain', [
      environment.ethers.network,
    ]).catch(e => {
      throw Error(`Ocorreu um erro ao adicionar a rede para se conectar com a aplicação: ${e.message}`);
    });
  }

  public connect(useWeb3: UseWeb3Store, get: UseWeb3Store, web3Modal: Web3Modal): UseWeb3Store['connect'] {
    return async () => {
      useWeb3.isConnected = true;

      const instance = await web3Modal.connect().catch(() => null);

      if (!instance) {
        useWeb3.isConnected = false;

        throw new Error('Não foi possível se conectar com a sua conta.');
      }

      const contract = useWeb3.certificateContract;

      if (!instance) {
        useWeb3.isConnected = false;

        throw new Error('Não foi possível encontrar a instância do contrato do certificado.');
      }

      const provider = new ethers.providers.Web3Provider(instance);

      await this.addNetwork(provider);

      provider.on('accountsChanged', async (accounts: string[]) => {
        console.trace(accounts);

        if (!accounts || accounts.length === 0) {
          useWeb3.myAddress = null;
          useWeb3.signer = null;
          useWeb3.isConnected = false;
          useWeb3.instance = null;
          useWeb3.provider = null;

          return;
        }

        const [defaultAccount] = accounts;

        const signer = provider.getSigner(defaultAccount);

        const myAddress = await signer.getAddress();

        useWeb3.signer = signer;
        useWeb3.myAddress = myAddress;
      });

      // Subscribe to chainId change
      provider.on('chainChanged', (chainId: number) => {
        console.trace(chainId);
      });

      // Subscribe to provider connection
      provider.on('connect', (info: { chainId: number }) => {
        console.trace(info);
      });

      // Subscribe to provider disconnection
      provider.on('disconnect', (error: { code: number; message: string }) => {
        console.trace(error);

        web3Modal.clearCachedProvider();

        useWeb3.myAddress = null;
        useWeb3.signer = null;
        useWeb3.isConnected = false;
        useWeb3.instance = null;
        useWeb3.provider = null;
      });

      const signer = provider.getSigner();

      const myAddress = await signer.getAddress();

      const isOwner = await contract.owner().then(ownerAddress => ownerAddress === myAddress);

      useWeb3.myAddress = myAddress;
      useWeb3.instance = instance;
      useWeb3.provider = provider;
      useWeb3.signer = signer;
      useWeb3.isConnected = true;
      useWeb3.isConnecting = false;
      useWeb3.isOwner = isOwner;
    };
  }

  public logout(useWeb3: UseWeb3Store, web3Modal: Web3Modal): UseWeb3Store['logout'] {
    return function () {
      web3Modal.clearCachedProvider();

      useWeb3.myAddress = null;
      useWeb3.signer = null;
      useWeb3.isConnected = false;
      useWeb3.instance = null;
      useWeb3.provider = null;

      useWeb3.setupDefaultContract();
    };
  }

  //#endregion

}