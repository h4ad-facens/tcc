//#region Imports

import { Injectable } from '@angular/core';
import { Signer } from '@ethersproject/abstract-signer';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import type Web3Modal from 'web3modal';
import { environment } from '../../../../environments/environment';
import { BidCoreAbi, DisputeCoreAbi, ProposalCoreAbi } from '../contracts';
import { BidCore } from '../contracts/BidCore';
import { DisputeCore } from '../contracts/DisputeCore';
import { ProposalCore } from '../contracts/ProposalCore';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class Web3Service {

  constructor() {
    this.setupDefaultContract();
  }

  public setupDefaultContract() {
    const freeRpcProvider = new JsonRpcProvider(environment.ethers.freeRpcEndpoint);

    this.proposalContract = new ethers.Contract(environment.ethers.contractAddress.proposal, ProposalCoreAbi, freeRpcProvider) as ProposalCore;
    this.bidContract = new ethers.Contract(environment.ethers.contractAddress.bids, BidCoreAbi, freeRpcProvider) as BidCore;
    this.disputeContract = new ethers.Contract(environment.ethers.contractAddress.dispute, DisputeCoreAbi, freeRpcProvider) as DisputeCore;
  }

  public proposalContract!: ProposalCore;
  public bidContract!: BidCore;
  public disputeContract!: DisputeCore;

  private web3Modal?: Web3Modal;

  public web3Provider$: BehaviorSubject<Web3Provider | null> = new BehaviorSubject<Web3Provider | null>(null);
  public myAddress$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public signer$: BehaviorSubject<Signer | null> = new BehaviorSubject<Signer | null>(null);
  public isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private web3ModalInstance: any = null;

  //#region Public Functions

  public async addNetwork(provider: Web3Provider): Promise<void> {
    if (!environment.ethers.network)
      return;

    console.log(`Conectando com a rede: ${ environment.ethers.network.chainName }`);

    await provider.send('wallet_addEthereumChain', [
      environment.ethers.network,
    ]).catch(async e => {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: environment.ethers.network.chainId },
      ]).catch(() => {
        throw Error(`Ocorreu um erro ao adicionar a rede para se conectar com a aplicação: ${ e.message }`);
      });
    });
  }

  public async connect(): Promise<void> {
    if (!this.web3Modal)
      this.web3Modal = await import('web3modal').then(m => new m.default());

    const instance = await this.web3Modal.connect().catch(() => null);

    if (!instance) {
      throw new Error('Não foi possível se conectar com a sua conta.');
    }

    instance.on('accountsChanged', async (accounts: string[]) => {
      console.trace(accounts);

      if (!accounts || accounts.length === 0) {
        this.myAddress$.next(null);
        this.signer$.next(null);
        this.isConnected$.next(false);
        this.web3ModalInstance = null;
        this.web3Provider$.next(null);

        return;
      }

      const [defaultAccount] = accounts;

      const signer = this.web3Provider$.getValue()!.getSigner(defaultAccount);

      const myAddress = await signer.getAddress();

      this.myAddress$.next(myAddress);
      this.signer$.next(signer);
    });

    // Subscribe to chainId change
    instance.on('chainChanged', async (chainId: number) => {
      console.trace(chainId);

      await this.connectWithChain(instance);
    });

    // Subscribe to provider connection
    instance.on('connect', (info: { chainId: number }) => {
      console.trace(info);
    });

    // Subscribe to provider disconnection
    instance.on('disconnect', (error: { code: number; message: string }) => {
      console.trace(error);

      this.logout();
    });

    await this.connectWithChain(instance);
  }

  private async connectWithChain(instance: any): Promise<void> {
    const provider = new ethers.providers.Web3Provider(instance);

    await this.addNetwork(provider);

    const signer = provider.getSigner();

    const myAddress = await signer.getAddress();

    this.web3ModalInstance = instance;
    this.web3Provider$.next(provider);
    this.myAddress$.next(myAddress);
    this.signer$.next(signer);
    this.isConnected$.next(true);
  }

  public logout(): void {
    this.web3ModalInstance.clearCachedProvider();

    this.myAddress$.next(null);
    this.signer$.next(null);
    this.isConnected$.next(false);
    this.web3ModalInstance = null;
    this.web3Provider$.next(null);

    this.setupDefaultContract();
  }

  //#endregion

}
