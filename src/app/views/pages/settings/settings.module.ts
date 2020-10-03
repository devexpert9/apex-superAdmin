import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';

@NgModule({
  
  imports: [
  	FormsModule, ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent
      },
    ]),
  ]
})
export class SettingsModule { }
