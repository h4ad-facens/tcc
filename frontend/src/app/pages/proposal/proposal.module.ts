//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ProposalComponent } from './proposal.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
  ],
  declarations: [
    ProposalComponent,
  ],
})
export class ProposalModule {}
