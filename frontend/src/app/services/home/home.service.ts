//#region Imports

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Web3Service } from "../../modules/web3/services/web3.service";

//#endregion

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  constructor(
    private readonly web3Service: Web3Service,
  ) { }

  private readonly isConnectedSubscription: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public async connectWallet(): Promise<void> {
    await this.web3Service.connect();
    this.isConnectedSubscription.next(true);
  }

  public isWalletConnected$(): Observable<boolean> {
    return this.isConnectedSubscription.asObservable();
  }

}