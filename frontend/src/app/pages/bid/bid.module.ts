//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidCardModule } from '../../components/bid-card/bid-card.module';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { BidComponent } from './bid.component';

//#endregion

const routes: Routes = [{ path: '', component: BidComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    BidCardModule,
  ],
  declarations: [
    BidComponent,
  ],
})
export class BidModule {}
