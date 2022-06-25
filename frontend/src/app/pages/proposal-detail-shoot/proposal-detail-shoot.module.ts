//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ProposalDetailShootComponent } from './proposal-detail-shoot.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalDetailShootComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    FormsModule,
  ],
  declarations: [
    ProposalDetailShootComponent,
  ],
})
export class ProposalDetailShootModule {}
