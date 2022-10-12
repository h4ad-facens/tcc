//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeCardModule } from '../home-card/home-card.module';
import { DisputeCardComponent } from './dispute-card.component';

//#endregion

@NgModule({
  imports: [
    CommonModule,
    HomeCardModule,
  ],
  declarations: [
    DisputeCardComponent,
  ],
  exports: [
    DisputeCardComponent,
  ],
})
export class DisputeCardModule {}
