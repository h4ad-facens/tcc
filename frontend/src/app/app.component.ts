//#region Imports

import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { NavbarStateEnum } from './models/enums/navbar-state.enum';
import { Web3Service } from './modules/web3/services/web3.service';
import { NavbarService } from './services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {

  //#region Constructors

  constructor(
    protected readonly navbarService: NavbarService,
    protected readonly web3: Web3Service,
  ) {
    this.navbarSubscription = this.navbarService.getCurrentNavbar$().subscribe(value => {
      if (!value)
        return;

      this.currentNavbar = value;
    });

    this.myAddress$ = this.web3.myAddress$.asObservable();
  }

  //#endregion

  //#region Public Properties

  public currentNavbar: NavbarStateEnum = NavbarStateEnum.HOME;

  public navbarStates: typeof NavbarStateEnum = NavbarStateEnum;

  public navbarSubscription: Subscription;

  public imageBaseUrl: string = environment.imageBaseUrl;

  public myAddress$: Observable<string | null>;

  //#endregion

  //#region Public Functions

  public ngOnDestroy(): void {
    this.navbarSubscription?.unsubscribe();
  }

  public async enterWithWallet(): Promise<void> {
    await this.web3.connect();
  }

  //#endregion

}
