import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyPageComponent } from './my-page.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { PartialsModule } from '../../partials/partials.module';

@NgModule({
  declarations: [MyPageComponent],
  imports: [
  	FormsModule, ReactiveFormsModule,RichTextEditorAllModule,PartialsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MyPageComponent
      },
    ]),
  ]
})
export class MyPageModule { }
