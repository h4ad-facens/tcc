//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ProposalDetailChallengeDistributeComponent } from './proposal-detail-challenge-distribute.component';

//#endregion

const routes: Routes = [
  { path: '', component: ProposalDetailChallengeDistributeComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    FormsModule,
  ],
  declarations: [
    ProposalDetailChallengeDistributeComponent,
  ],
})
export class ProposalDetailChallengeDistributeModule {}
