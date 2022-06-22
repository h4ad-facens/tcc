//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { ShootComponent } from './shoot.component';

//#endregion

const routes: Routes = [{ path: '', component: ShootComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
  ],
  declarations: [
    ShootComponent,
  ],
})
export class ShootModule {}
