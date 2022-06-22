//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { DisputeComponent } from './dispute.component';

//#endregion

const routes: Routes = [{ path: '', component: DisputeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
  ],
  declarations: [
    DisputeComponent,
  ],
})
export class DisputeModule {}
