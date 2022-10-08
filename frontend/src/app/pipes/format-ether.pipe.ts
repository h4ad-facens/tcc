import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'ethers';
import { formatEther } from '../utils/ether';

@Pipe({
  name: 'formatEther',
})
export class FormatEther implements PipeTransform {
  transform(ether: BigNumber): string {
    return formatEther(ether);
  }
}

@NgModule({
  exports: [
    FormatEther,
  ],
  declarations: [
    FormatEther,
  ],
})
export class FormatEtherModule {}
