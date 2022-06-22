//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalComponent } from './proposal.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ProposalComponent,
  ],
})
export class ProposalModule {}
