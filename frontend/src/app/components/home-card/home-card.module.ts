//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarBauhausModule } from '../../modules/boring-avatars/avatar-bauhaus/avatar-bauhaus.module';
import { AvatarBeamModule } from '../../modules/boring-avatars/avatar-beam/avatar-beam.module';
import { ProposalStatusPipeModule } from '../../pipes/proposal-status.pipe';
import { HomeCardComponent } from './home-card.component';

//#endregion

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AvatarBeamModule,
    AvatarBauhausModule,
    ProposalStatusPipeModule,
  ],
  declarations: [
    HomeCardComponent,
  ],
  exports: [
    HomeCardComponent,
  ],
})
export class HomeCardModule {}
