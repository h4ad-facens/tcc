//#region Imports

import { Injectable } from '@angular/core';
import { Signer } from '@ethersproject/abstract-signer';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { environment } from '../../../../environments/environment';
import { BidCore } from '../nft/BidCore';
import { BidCoreAbi, ProposalCoreAbi } from '../nft/index';
import { ProposalCore } from '../nft/ProposalCore';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class Web3Service {

  constructor() {
    this.setupDefaultContract();

    // this.proposalContract.createProposal('', '', '', '', {
    //   value: ethers.utils.parseEther('1eth'),
    // }); // método para passar o valor do Ether
    // this.proposalContract.connect(this.signer!).createProposal(); // método que precisam estar logados (assinados)
  }

  public setupDefaultContract() {
    const freeRpcProvider = new JsonRpcProvider(environment.ethers.freeRpcEndpoint);

    this.proposalContract = new ethers.Contract(environment.ethers.contractAddress.proposal, ProposalCoreAbi, freeRpcProvider) as ProposalCore;
    this.bidContract = new ethers.Contract(environment.ethers.contractAddress.bids, BidCoreAbi, freeRpcProvider) as BidCore;
  }

  private proposalContract!: ProposalCore;
  private bidContract!: BidCore;

  private web3Modal = new Web3Modal();

  public myAddress: string | null = null;
  public signer: Signer | null = null;
  public isConnected: boolean = false;

  private web3ModalInstance: any = null;
  private web3Provider: Web3Provider | null = null;

  //#region Public Functions

  public async addNetwork(provider: Web3Provider): Promise<void> {
    if (!environment.ethers.network)
      return;

    console.log(`Conectando com a rede: ${ environment.ethers.network.chainName }`);

    await provider.send('wallet_addEthereumChain', [
      environment.ethers.network,
    ]).catch(e => {
      throw Error(`Ocorreu um erro ao adicionar a rede para se conectar com a aplicação: ${ e.message }`);
    });
  }

  public async connect() {
    const instance = await this.web3Modal.connect().catch(() => null);

    if (!instance) {
      throw new Error('Não foi possível se conectar com a sua conta.');
    }

    const provider = new ethers.providers.Web3Provider(instance);

    await this.addNetwork(provider);

    provider.on('accountsChanged', async (accounts: string[]) => {
      console.trace(accounts);

      if (!accounts || accounts.length === 0) {
        this.myAddress = null;
        this.signer = null;
        this.isConnected = false;
        this.web3ModalInstance = null;
        this.web3Provider = null;

        return;
      }

      const [defaultAccount] = accounts;

      const signer = provider.getSigner(defaultAccount);

      const myAddress = await signer.getAddress();

      this.signer = signer;
      this.myAddress = myAddress;
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

      instance.clearCachedProvider();

      this.myAddress = null;
      this.signer = null;
      this.isConnected = false;
      this.web3ModalInstance = null;
      this.web3Provider = null;

    });

    const signer = provider.getSigner();

    const myAddress = await signer.getAddress();

    this.myAddress = myAddress;
    this.web3ModalInstance = instance;
    this.web3Provider = provider;
    this.signer = signer;
    this.isConnected = true;
  }

  public logout() {
    this.web3ModalInstance.clearCachedProvider();

    this.myAddress = null;
    this.signer = null;
    this.isConnected = false;
    this.web3ModalInstance = null;
    this.web3Provider = null;

    this.setupDefaultContract();
  }

  //#endregion

}
