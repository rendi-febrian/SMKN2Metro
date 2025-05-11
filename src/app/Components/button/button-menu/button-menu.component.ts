import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss'],
  standalone : false
})
export class ButtonMenuComponent implements AfterViewInit {
  @ViewChild('buttonIconRef')
  buttonIconRef!: IonIcon;

  /** icon can be relative path or ionic icon name */;
  @Input()
  icon: string = 'grid';

  @Input()
  label: string = 'Label';

  attributes: { [key: string]: any } = {
    ...(this.icon.includes('/') && { src: this.icon }),
    ...(!this.icon.includes('/') && { name: this.icon }),
  }

  constructor(private renderer2: Renderer2) {
  }
  
  ngAfterViewInit(): void {
    this.attributes = this.generateDynamicAttribute();
    this.renderWithDynamicAttribute();
  }

  generateDynamicAttribute() {
    return {
      ...(this.icon.includes('/') && { src: this.icon }),
      ...(!this.icon.includes('/') && { name: this.icon }),
    }
  }

  renderWithDynamicAttribute() {
    for (let attributeName in this.attributes) {
      const attributeValue = this.attributes[attributeName];
      if (attributeValue) {
        this.renderer2?.setAttribute(this.buttonIconRef['el'], attributeName, attributeValue);
      } else {
        this.renderer2?.removeAttribute(this.buttonIconRef['el'], attributeName);
      }
    }
  }

}
