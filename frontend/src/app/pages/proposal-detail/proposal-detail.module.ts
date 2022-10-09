//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BidItemModule } from '../../components/bid-item/bid-item.module';
import { ErrorMessageModule } from '../../components/error-message/error-message.module';
import { HomeCardModule } from '../../components/home-card/home-card.module';
import { AvatarBauhausModule } from '../../modules/boring-avatars/avatar-bauhaus/avatar-bauhaus.module';
import { AvatarBeamModule } from '../../modules/boring-avatars/avatar-beam/avatar-beam.module';
import { BoringPipeModule } from '../../pipes/boring.pipe';
import { FormatEtherModule } from '../../pipes/format-ether.pipe';
import { ProposalStatusPipeModule } from '../../pipes/proposal-status.pipe';
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
    AvatarBauhausModule,
    AvatarBeamModule,
    ErrorMessageModule,
    BidItemModule,
    ProposalStatusPipeModule,
  ],
  declarations: [
    ProposalDetailComponent,
  ],
})
export class ProposalDetailModule {}
