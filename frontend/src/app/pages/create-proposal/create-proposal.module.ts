//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { CreateProposalComponent } from './create-proposal.component';

//#endregion

const routes: Routes = [{ path: '', component: CreateProposalComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    FormsModule,
  ],
  declarations: [
    CreateProposalComponent,
  ],
})
export class CreateProposalModule {}
