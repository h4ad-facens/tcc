//#region Imports

import { Component } from '@angular/core';
import { DisputeStatusEnum } from '../../models/enums/dispute-status.enum';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
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

  public disputeEnum: typeof DisputeStatusEnum = DisputeStatusEnum;

  public choosingProposal = {
    id: 1,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: '',
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
    disputeStatus: DisputeStatusEnum.CHOOSING,
  };

  public awaitingProposal = {
    id: 2,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: '',
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
    disputeStatus: DisputeStatusEnum.AWAITING,
  };

  public finishedProposal = {
    id: 3,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: '',
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
    disputeStatus: DisputeStatusEnum.FINISHED,
  };

  public distributeProposal = {
    id: 3,
    title: 'Freeelancer C#/ReactJs - Projeto de Landing Page',
    description: '',
    category: '',
    contact: '',
    price: 400,
    imageUrl: '',
    disputeStatus: DisputeStatusEnum.DISTRIBUTE,
  };

  //#endregion

}
