import { Component, Input, OnInit } from '@angular/core';
import { getBoolean, getNumber, getRandomColor, getUnit } from '../utilities';

interface IBauhausElementProperties {
  color: string;
  isSquare: boolean;
  rotate: number;
  translateX: number;
  translateY: number;
}

@Component({
  selector: 'ng-bauhaus-avatar',
  template: `
    <ng-container *ngIf="properties">
      <svg
        [attr.viewBox]="'0 0 ' + SIZE + ' ' + SIZE"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        [style.background-color]="fillBackground ? properties[0].color : undefined"
        [attr.width]="inputSize"
        [attr.height]="inputSize"
        [attr.colors]="colors"
        [attr.name]="name"
        [attr.size]="inputSize"
      >
        <mask
          [id]="randomId"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          [attr.width]="SIZE"
          [attr.height]="SIZE"
        >
          <rect [attr.width]="SIZE" [attr.height]="SIZE" [attr.rx]="square ? 0 : SIZE / 2" [attr.fill]="properties[0].color" />
        </mask>
        <g [attr.mask]="'url(#' + randomId + '})'">
          <rect
            [attr.width]="SIZE"
            [attr.height]="SIZE"
            [attr.rx]="square ? 0 : SIZE / 2"
            [attr.fill]="properties[0].color"
          />
          <rect
            [attr.x]="(SIZE - 60) / 2"
            [attr.y]="(SIZE - 20) / 2"
            [attr.width]="SIZE"
            [attr.height]="properties[1].isSquare ? SIZE : SIZE/8"
            [attr.fill]="properties[1].color"
            [attr.transform]="'translate(' + (properties[1].translateX) + ' ' + (properties[1].translateY) + ') rotate(' + properties[1].rotate + ' ' + SIZE / 2 + ' ' + SIZE / 2  +')'"
          />
          <circle
            [attr.cx]="SIZE / 2"
            [attr.cy]="SIZE / 2"
            [attr.fill]="properties[2].color"
            [attr.r]="SIZE / 5"
            [attr.transform]="'translate(' + properties[2].translateX + ' ' + properties[2].translateY + ')'"
          />
          <line
            x1="0"
            [attr.y1]="SIZE / 2"
            [attr.x2]="SIZE"
            [attr.y2]="SIZE / 2"
            stroke-width="2"
            [attr.stroke]="properties[3].color"
            [attr.transform]="'translate(' + properties[3].translateX + ' ' + properties[3].translateY + ') rotate(' + properties[3].rotate + ' ' + SIZE / 2 + ' ' + SIZE / 2 +')'"
          />
        </g>
      </svg>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class AvatarBauhausComponent implements OnInit {
  @Input() colors: Array<string> | undefined = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];
  @Input() name: string | undefined;
  @Input() inputSize: number | string | undefined;
  @Input() square: boolean = false;
  @Input() fillBackground: boolean = false;

  public readonly randomId: string = 'mask_' + Math.random().toString(16).slice(2);

  private ELEMENTS = 4;
  public SIZE = 80;
  public properties: Array<IBauhausElementProperties> | undefined;

  ngOnInit() {
    if (this.name === undefined) {
      throw new Error('Input \'name\' must be defined.');
    }

    if (this.colors === undefined) {
      throw new Error('Input \'colors\' must be defined.');
    }

    this.properties = this.generateColors(this.name, this.colors);
  }

  generateColors(name: string, colors: Array<string>): Array<IBauhausElementProperties> {
    const numFromName = getNumber(name);
    const range = colors && colors.length;

    return Array.from({ length: this.ELEMENTS }, (_, i) => ({
      color: getRandomColor(numFromName + i, colors, range),
      translateX: getUnit(numFromName * (i + 1), (this.SIZE / 2 - (i + 17)), 1),
      translateY: getUnit(numFromName * (i + 1), (this.SIZE / 2 - (i + 17)), 2),
      rotate: getUnit(numFromName * (i + 1), 360, null),
      isSquare: getBoolean(numFromName, 2),
    }));
  }
}
