//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisputeComponent } from './dispute.component';

//#endregion

const routes: Routes = [{ path: '', component: DisputeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DisputeComponent,
  ],
})
export class DisputeModule {}
