//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { BoringPipeModule } from '../../pipes/boring.pipe';
import { FormatEtherModule } from '../../pipes/format-ether.pipe';
import { ProposalDetailComponent } from './proposal-detail.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalDetailComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HomeCardModule,
    FormsModule,
    BoringPipeModule,
    FormatEtherModule,
  ],
  declarations: [
    ProposalDetailComponent,
  ],
})
export class ProposalDetailModule {}
