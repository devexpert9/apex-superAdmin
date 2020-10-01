import { AfterViewInit, AfterViewChecked } from '@angular/core';
// Angular
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
import { AppState } from '../../../../../core/reducers';
import { AdminService } from '../../../../../services/admin.service';

// Services
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../../core/_base/crud';
// Models
import {
	User,
	Role,
	UsersDataSource,
	UserDeleted,
	UsersPageRequested,
	selectUserById,
	selectAllRoles
} from '../../../../../core/auth';
import { SubheaderService } from '../../../../../core/_base/layout';

import { NgxUiLoaderService } from 'ngx-ui-loader';

// Table with EDIT item in MODAL
// ARTICLE for table with sort/filter/paginator
// https://blog.angular-university.io/angular-material-data-table/
// https://v5.material.angular.io/components/table/overview
// https://v5.material.angular.io/components/sort/overview
// https://v5.material.angular.io/components/table/overview#sorting
// https://www.youtube.com/watch?v=NSt9CI3BXv4
@Component({
	selector: 'kt-users-list',
	templateUrl: './users-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

  

export class UsersListComponent implements OnInit, OnDestroy {
	// Table fields
	// dataSource: UsersDataSource;
	
	displayedColumns = [ 'fullname', 'email', 'created_on', 'actions'];
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
	// @ViewChild('sort1', {static: true}) sort: MatSort;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
	lastQuery: QueryParamsModel;
	dataSource = new MatTableDataSource;
	// public loading$ = new Subject<boolean>();
	// Selection
	selection = new SelectionModel<User>(true, []);
	usersResult: User[] = [];
	allRoles: Role[] = [];

	// displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  	// dataSource = new MatTableDataSource;

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

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		
		this.ngxService.start();
		// load roles list
		// const rolesSubscription = this.store.pipe(select(selectAllRoles)).subscribe(res => this.allRoles = res);
		// this.subscriptions.push(rolesSubscription);

		// // If the user changes the sort order, reset back to the first page.
		// const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		// this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		// const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
		// 	tap(() => {
		// 		this.loadUsersList();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(paginatorSubscriptions);


		// Filtration, bind to searchInput
		// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
		// 	// tslint:disable-next-line:max-line-length
		// 	debounceTime(150), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
		// 	distinctUntilChanged(), // This operator will eliminate duplicate values
		// 	tap(() => {
		// 		this.paginator.pageIndex = 0;
		// 		// this.getAllAgentsData();
		// 		this.loadUsersList();
		// 	})
		// )
		// .subscribe();
		// this.subscriptions.push(searchSubscription);

		// // Set title to page breadCrumbs
		this.subheaderService.setTitle('Agent Management');

		// Init DataSource
		// this.dataSource = new UsersDataSource(this.pageData); //this.pageData;//
		// const entitiesSubscription = this.dataSource.entitySubject.pipe(
		// 	skip(1),
		// 	distinctUntilChanged()
		// ).subscribe(res => {
		// 	this.usersResult = res;
		// });

		// this.subscriptions.push(entitiesSubscription);

		// First Load
		// of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
		// 	this.loadUsersList();
		// });

		this.getAllAgentsData();
		this.dataSource.filterPredicate = (data: any, filter: string) => {
	      return data.name == filter;
	     };
	}

	applyFilter(filterValue: string) {
	    filterValue = filterValue.trim(); // Remove whitespace
	    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
	    this.dataSource.filter = filterValue;
  	}

	getAllAgentsData(){
		// this.loading$.next(true);
	    let dict = {
	      "page" : "home",
	    };
	    this.adminService.postData('listuser',dict).subscribe((response: any) => {
	      console.log("AGENTS = "+response);
	      this.pageData = response.data;
	      const ELEMENT_DATA = response.data.reverse();
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
		filter.email 	= searchText;
		filter.fillname = searchText;
		return filter;
	}

	goBackWithId() {
		const url = '/user-management/users';
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/** ACTIONS */
	/**
	 * Delete user
	 *
	 * @param _item: User
	 */
	deleteUser(id)
	{
		const _title 			= 'User Delete';
		const _description 		= 'Are you sure to permanently delete this agent?';
		const _waitDesciption 	= 'Agent is deleting...';
		const _deleteMessage 	= `Agent has been deleted`;

		if (confirm('Are you sure you want to delete this agent?'))
    	{
    		let dict = {
	      		"userid" : id,
	      	};

	      	this.adminService.postData('deleteuser',dict).subscribe((response:any) => {
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

	/**
	 * Fetch selected rows
	 */
	fetchUsers() {
		const messages = [];
		this.selection.selected.forEach(elem => {
			messages.push({
				text: `${elem.fullname}, ${elem.email}`,
				id: elem.id.toString(),
				status: elem.username
			});
		});
		this.layoutUtilsService.fetchElements(messages);
	}

	/**
	 * Check all rows are selected
	 */
	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.usersResult.length;
		return numSelected === numRows;
	}

	/**
	 * Toggle selection
	 */
	masterToggle() {
		if (this.selection.selected.length === this.usersResult.length) {
			this.selection.clear();
		} else {
			this.usersResult.forEach(row => this.selection.select(row));
		}
	}

	/* UI */
	/**
	 * Returns user roles string
	 *
	 * @param user: User
	 */
	getUserRolesStr(user: User): string {
		const titles: string[] = [];
		each(user.roles, (roleId: number) => {
			const _role = find(this.allRoles, (role: Role) => role.id === roleId);
			if (_role) {
				titles.push(_role.title);
			}
		});
		return titles.join(', ');
	}

	/**
	 * Redirect to edit page
	 *
	 * @param id
	 */
	editUser(id) {
		this.router.navigate(['../users/edit', id], { relativeTo: this.activatedRoute });
	}

	manageExpiryDate(date){
		console.log(date);
		var x = 3; //or whatever offset
		var CurrentDate = new Date(date);
		console.log("Current date:", CurrentDate);
		CurrentDate.setMonth(CurrentDate.getMonth() + x);
		console.log("Date after " + x + " months:", CurrentDate);
		return CurrentDate;
	}

	updateStatus(user, status, msg)
	{
		// if (confirm(msg))
  //   	{
			let dict = {
		      "_id" : user._id,
		      "status": status
		    };
		    this.adminService.postData('updateAgentStatus',dict).subscribe((response: any) => {
		      this.getAllAgentsData();
		    });
		// }
	}
}
