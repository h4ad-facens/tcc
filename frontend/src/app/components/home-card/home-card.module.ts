//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BoringPipeModule } from '../../pipes/boring.pipe';
import { HomeCardComponent } from './home-card.component';

//#endregion

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BoringPipeModule,
  ],
  declarations: [
    HomeCardComponent,
  ],
  exports: [
    HomeCardComponent,
  ],
})
export class HomeCardModule {}
