//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidCardModule } from '../../components/bid-card/bid-card.module';
import { DisputeCardModule } from '../../components/dispute-card/dispute-card.module';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { DisputeComponent } from './dispute.component';

//#endregion

const routes: Routes = [{ path: '', component: DisputeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    BidCardModule,
    DisputeCardModule,
  ],
  declarations: [
    DisputeComponent,
  ],
})
export class DisputeModule {}
