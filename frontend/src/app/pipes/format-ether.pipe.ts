import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'ethers';
import { environment } from '../../environments/environment';
import { formatEther } from '../utils/ether';

@Pipe({
  name: 'formatEther',
})
export class FormatEther implements PipeTransform {
  transform(ether: BigNumber): string {
    return formatEther(ether) + ` ${ environment.ethers.network.nativeCurrency.name.toLowerCase() }`;
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
