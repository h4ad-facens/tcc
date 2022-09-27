//#region Imports

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { NavbarStateEnum } from './models/enums/navbar-state.enum';
import { HomeService } from './services/home/home.service';
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
    private readonly navbarService: NavbarService,
    private readonly homeService: HomeService,
  ) {
    this.navbarSubscription = this.navbarService.getCurrentNavbar$().subscribe(value => {
      if (!value)
        return;

      this.currentNavbar = value;
    });

    this.isWalletConnectedSubscription = this.homeService.isWalletConnected$().subscribe(value => {
      console.log(value);
      this.isWalletConnected = value;
    })
  }

  //#endregion

  //#region Public Properties

  public currentNavbar: NavbarStateEnum = NavbarStateEnum.HOME;

  public navbarStates: typeof NavbarStateEnum = NavbarStateEnum;

  public navbarSubscription: Subscription;

  public imageBaseUrl: string = environment.imageBaseUrl;

  public isWalletConnectedSubscription: Subscription;

  public isWalletConnected: boolean = false;

  // TODO: add logout method

  //#endregion

  //#region Public Functions

  public ngOnDestroy(): void {
    this.navbarSubscription?.unsubscribe();
  }

  public async enterWithWallet(): Promise<void> {
    await this.homeService.connectWallet();
  }

  //#endregion

}
