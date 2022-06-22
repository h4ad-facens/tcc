//#region Imports

import { Component } from '@angular/core';
import { DisputeStatusEnum } from '../../models/enums/dispute-status.enum';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { CardInterface } from '../../models/interfaces/card.interface';
import { NavbarService } from '../../services/navbar/navbar.service';

//#endregion

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss'],
})
export class DisputeComponent {

  //#region Constructors

  constructor(
    private readonly navbarService: NavbarService,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.DISPUTE);
  }

  //#endregion

  //#region Public Properties

  public listCards: CardInterface[] = [
    {
      title: 'Freelancer C#/ReactJs - Projeto de Landing Page',
      price: 400,
      disputeStatus: DisputeStatusEnum.CHOOSING,
    },
    {
      title: 'Freelancer C#/ReactJs - Projeto de Landing Page',
      price: 400,
      disputeStatus: DisputeStatusEnum.AWAITING,
    },
    {
      title: 'Freelancer C#/ReactJs - Projeto de Landing Page',
      price: 400,
      disputeStatus: DisputeStatusEnum.FINISHED,
    },
  ];

  //#endregion

}
