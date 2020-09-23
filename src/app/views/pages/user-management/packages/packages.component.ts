import { AfterViewInit, AfterViewChecked } from '@angular/core';
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
// RXJS
import { debounceTime, distinctUntilChanged, tap, skip, take, delay } from 'rxjs/operators';
import { fromEvent, merge, Observable, of, Subscription } from 'rxjs';
// LODASH
import { each, find } from 'lodash';
// NGRX
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { AdminService } from '../../../../services/admin.service';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
// Models
import {
	User,
	Role,
	UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles
} from '../../../../core/auth';
import { SubheaderService } from '../../../../core/_base/layout';

import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'kt-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
	displayedColumns = ['name', 'price', 'timePeriod','actions'];
	dataSource = new MatTableDataSource;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	// @ViewChild('sort1', {static: true}) sort: MatSort;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	// Selection
	selection 			= new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	allRoles: Role[] 	= [];
	row: any;
	// displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  	

  	// @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

	// Subscriptions
	private subscriptions: Subscription[] = [];


	pageData:any = [];

	/**
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param store: Store<AppState>
	 * @param router: Router
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param subheaderService: SubheaderService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private store: Store<AppState>,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		public adminService: AdminService,
		private subheaderService: SubheaderService,
		private cdr: ChangeDetectorRef,
		private ngxService: NgxUiLoaderService) {}

  	ngOnInit() {
		
		this.ngxService.start();
		this.subheaderService.setTitle('Subscribed Users');

		 this.dataSource.filterPredicate = (data: any, filter: string) => {
	      return data.name == filter;
	     };
		this.getAllAgentsData();
	}

	applyFilter(filterValue: string) {
	    filterValue = filterValue.trim(); // Remove whitespace
	    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
	    this.dataSource.filter = filterValue;
  	}

	getAllAgentsData(){
	    let dict = {
	      "page" : "home",
	    };
	    this.adminService.postData('getAllPackages',dict).subscribe((response: any) => {
	      console.log("AGENTS = "+response);
	      this.pageData = response.data;
	      const ELEMENT_DATA = response.data;
	      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
	      this.dataSource.paginator = this.paginator;
	      this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
          this.ngxService.stop();
	    });
  	}
   
	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	selectedItem(row){
		console.log(row);
		// alert('booo');
		this.row = row;
	}

	/**
	 * Load users list
	 */
	loadUsersList() {
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		this.store.dispatch(new UsersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.lastName = searchText;

		filter.username = searchText;
		filter.email = searchText;
		filter.fillname = searchText;
		return filter;
	}

	deleteUser(id)
	{
		const _title 			= 'Package Delete';
		const _description 		= 'Are you sure to permanently delete this package?';
		const _waitDesciption 	= 'Package is deleting...';
		const _deleteMessage 	= `Package has been deleted`;

		if (confirm('Are you sure you want to delete this package?'))
    	{
    		let dict = {
	      		"_id" : id,
	      	};

	      	this.adminService.postData('deletePackage',dict).subscribe((response:any) => {
	      		if(response.status == 1)
	      		{
	      			this.store.dispatch(new UserDeleted({ id: id }));
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
					this.getAllAgentsData();
	      		}
	      		else
	      		{
		          alert('Something went wrong, please try again.');
		        }
			});
    	}
	}

	editUser(id) {
		this.router.navigate(['../packages/edit', id], { relativeTo: this.activatedRoute });
	}

}
