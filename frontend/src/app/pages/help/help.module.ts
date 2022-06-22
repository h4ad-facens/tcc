//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help.component';

//#endregion

const routes: Routes = [{ path: '', component: HelpComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    HelpComponent,
  ],
})
export class HelpModule {}
