//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ProposalDetailComponent } from './proposal-detail.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalDetailComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
  ],
  declarations: [
    ProposalDetailComponent,
  ],
})
export class ProposalDetailModule {}
