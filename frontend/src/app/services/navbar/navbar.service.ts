//#region Imports

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class NavbarService {

  //#region Properties

  private readonly selectedNavbar: BehaviorSubject<NavbarStateEnum> = new BehaviorSubject<NavbarStateEnum>(NavbarStateEnum.HOME);

  //#endregion

  //#region Functions

  public getCurrentNavbar$(): Observable<NavbarStateEnum> {
    return this.selectedNavbar.asObservable();
  }

  public setCurrentNavbar(currentNavbar: NavbarStateEnum): void {
    console.log(currentNavbar);
    this.selectedNavbar.next(currentNavbar);
  }

  //#endregion
}
