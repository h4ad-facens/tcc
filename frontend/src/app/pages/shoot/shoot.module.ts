//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShootComponent } from './shoot.component';

//#endregion

const routes: Routes = [{ path: '', component: ShootComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    ShootComponent,
  ],
})
export class ShootModule {}
