import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormatEtherModule } from '../../pipes/format-ether.pipe';

import { BidItemComponent } from './bid-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormatEtherModule,
  ],
  exports: [
    BidItemComponent,
  ],
  declarations: [
    BidItemComponent,
  ],
  providers: [],
})
export class BidItemModule {}
