import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'kt-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  displayedColumns = ['agent_name', 'agent_email', 'user_name', 'user_email', 'subject', 'contact_number', 'insurance', 'message', 'date'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  // @ViewChild('sort1', {static: true}) sort: MatSort;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // Filter fields
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  dataSource = new MatTableDataSource;

	inquiries:any = [];
  	constructor(private ngxService: NgxUiLoaderService,private fb: FormBuilder, public route: ActivatedRoute, public adminService: AdminService, public router: Router, public changeDetection: ChangeDetectorRef) { }

  ngOnInit() 
  {
    this.ngxService.start();
      this.adminService.postData('contactData',{}).subscribe((response:any) => {
    	console.log(response);
      this.ngxService.stop();
        this.inquiries = response.data;

        const ELEMENT_DATA  = response.data;
        this.dataSource     = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.changeDetection.detectChanges();
      });
  }
}
