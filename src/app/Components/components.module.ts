import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AvatarMainComponent } from './avatar/avatar-main/avatar-main.component';
import { BoxCentralizeComponent } from './box/box-centralize/box-centralize.component';
import { BoxSiswaComponent } from './box/box-siswa/box-siswa.component';
import { ButtonMenuComponent } from './button/button-menu/button-menu.component';
import { CardBlogComponent } from './card/card-blog/card-blog.component';
import { HeaderBackComponent } from './header/header-back/header-back.component';
import { HeaderMainComponent } from './header/header-main/header-main.component';
import { InputTextComponent } from './input/input-text/input-text.component';
import { TemplateEmptyComponent } from './template/template-empty/template-empty.component';

@NgModule({
    declarations: [
      AvatarMainComponent,
      BoxCentralizeComponent,
      BoxSiswaComponent,
      ButtonMenuComponent,
      CardBlogComponent,
      HeaderBackComponent,
      HeaderMainComponent,
      InputTextComponent,
      TemplateEmptyComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    exports: [
      AvatarMainComponent,
      BoxCentralizeComponent,
      BoxSiswaComponent,
      ButtonMenuComponent,
      CardBlogComponent,
      HeaderBackComponent,
      HeaderMainComponent,
      InputTextComponent,
      TemplateEmptyComponent,
    ]
})
export class ComponentsModule {}
