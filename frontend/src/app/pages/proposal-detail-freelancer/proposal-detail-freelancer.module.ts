//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { BoringPipeModule } from '../../pipes/boring.pipe';
import { FormatEtherModule } from '../../pipes/format-ether.pipe';
import { ProposalDetailFreelancerComponent } from './proposal-detail-freelancer.component';

//#endregion

const routes: Routes = [{ path: '', component: ProposalDetailFreelancerComponent }];

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
    ProposalDetailFreelancerComponent,
  ],
})
export class ProposalDetailFreelancerModule {}
