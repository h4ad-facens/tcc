//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HomeCardComponent } from './home-card.component';

//#endregion

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    HomeCardComponent,
  ],
  exports: [
    HomeCardComponent,
  ],
})
export class HomeCardModule {}
