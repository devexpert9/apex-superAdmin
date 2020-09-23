import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AgentsComponent } from './agents.component';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
  
  imports: [
    CommonModule,DataTablesModule,MatTableModule,MatPaginatorModule,MatSortModule,
    RouterModule.forChild([
      {
        path: '',
        component: AgentsComponent
      },
    ]),
  ]
})
export class AgentsModule { }
