//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ProposalDetailChallengeSelectedComponent } from './proposal-detail-challenge-selected.component';
import { ProposalDetailChallengeComponent } from './proposal-detail-challenge.component';

//#endregion

const routes: Routes = [
  { path: '', component: ProposalDetailChallengeComponent },
  { path: 'selected', component: ProposalDetailChallengeSelectedComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    FormsModule,
  ],
  declarations: [
    ProposalDetailChallengeComponent,
    ProposalDetailChallengeSelectedComponent,
  ],
})
export class ProposalDetailChallengeModule {}
