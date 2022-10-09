//#region Imports

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarBauhausModule } from '../../modules/boring-avatars/avatar-bauhaus/avatar-bauhaus.module';
import { AvatarBeamModule } from '../../modules/boring-avatars/avatar-beam/avatar-beam.module';
import { BoringPipeModule } from '../../pipes/boring.pipe';
import { BidCardComponent } from './bid-card.component';

//#endregion

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AvatarBeamModule,
    AvatarBauhausModule,
  ],
  declarations: [
    BidCardComponent,
  ],
  exports: [
    BidCardComponent,
  ],
})
export class BidCardModule {}
