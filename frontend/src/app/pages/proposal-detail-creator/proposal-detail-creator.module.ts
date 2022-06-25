//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ProposalDetailCreatorComponent } from './proposal-detail-creator.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalDetailCreatorComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    FormsModule,
  ],
  declarations: [
    ProposalDetailCreatorComponent,
  ],
})
export class ProposalDetailCreatorModule {}
