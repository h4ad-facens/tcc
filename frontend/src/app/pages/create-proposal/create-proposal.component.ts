//#region Imports

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavbarStateEnum } from '../../models/enums/navbar-state.enum';
import { ProposalPayload } from '../../models/payloads/proposal.payload';
import { NavbarService } from '../../services/navbar/navbar.service';
import { ProposalService } from '../../services/proposal/proposal.service';

//#endregion

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent {

  //#region Constructors

  constructor(
    protected readonly navbarService: NavbarService,
    protected readonly router: Router,
    protected readonly proposalService: ProposalService,
    protected readonly fb: FormBuilder,
  ) {
    this.navbarService.setCurrentNavbar(NavbarStateEnum.PROPOSAL);

    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      amount: [undefined, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required, Validators.minLength(3)]],
      contactInfo: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  //#endregion

  //#region Public Properties

  public readonly formGroup: FormGroup;

  public isLoading: boolean = false;
  public errorMessage?: string;

  public imageBaseUrl: string = environment.imageBaseUrl;

  //#endregion

  //#region Public Functions

  public async createProposal(): Promise<void> {
    this.errorMessage = void 0;
    this.isLoading = true;

    const payload = this.formGroup.getRawValue();
    const [isSuccess, error] = await this.proposalService.createProposal(payload);

    this.isLoading = false;

    this.errorMessage = error;

    if (!isSuccess)
      return;

    await this.router.navigateByUrl('/proposal');
  }

  //#endregion

}
