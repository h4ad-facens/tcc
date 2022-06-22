//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardComponent } from '../../components/home-card/home-card.component';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { HomeComponent } from './home.component';

//#endregion

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
  ],
  declarations: [
    HomeComponent,
  ],
})
export class HomeModule {}
