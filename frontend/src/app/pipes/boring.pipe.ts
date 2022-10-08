import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boring',
})
export class BoringPipe implements PipeTransform {
  transform(seed: string | undefined, type: 'bauhaus' | 'beam'): string {
    return BoringPipe.getSvg(seed, type);
  }

  public static getSvg(seed: string | undefined, type: 'bauhaus' | 'beam'): string {
    const rand = btoa(encodeURIComponent(seed || Math.random().toString(16).slice(2))).slice(32);
    const url = `https://source.boringavatars.com/bauhaus/512/${ rand }?colors=264653,2a9d8f,e9c46a,f4a261,e76f51${ type === 'bauhaus' ? '&square=bauhaus' : '' }`;

    return url;
  }
}

@NgModule({
  exports: [
    BoringPipe,
  ],
  declarations: [
    BoringPipe,
  ],
})
export class BoringPipeModule {}
