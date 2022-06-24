//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeCardComponent } from './home-card.component';

//#endregion

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    HomeCardComponent,
  ],
  exports: [
    HomeCardComponent,
  ],
})
export class HomeCardModule {}
