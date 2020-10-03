import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../core/_base/crud';

import { AdminService } from '../../../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
// Services and Models

import {
	User,
	UserUpdated,
	Address,
	SocialNetworks,
	selectHasUsersInStore, 
	selectUserById,
	UserOnServerCreated,
	selectLastCreatedUserId,
	selectUsersActionLoading
} from '../../../../core/auth';

@Component({
  selector: 'kt-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {

  user: User;
	userId$: Observable<number>;
	oldUser: User;
	userId: any;
	name: any;
	selectedTab = 0;
	loading$: Observable<boolean>;
	rolesSubject = new BehaviorSubject<number[]>([]);
	addressSubject = new BehaviorSubject<Address>(new Address());
	soicialNetworksSubject = new BehaviorSubject<SocialNetworks>(new SocialNetworks());
	userForm: FormGroup;
	hasFormErrors = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param userFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService
	 * @param store: Store<AppState>
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private activatedRoute: ActivatedRoute,
		           private router: Router,
		           private userFB: FormBuilder,
		           private subheaderService: SubheaderService,
		           private layoutUtilsService: LayoutUtilsService,
		           private store: Store<AppState>,
		           public adminService: AdminService,
		           private layoutConfigService: LayoutConfigService,
		           private ngxService: NgxUiLoaderService) { }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.ngxService.start();
		// this.loading$ = this.store.pipe(select(selectUsersActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			console.log(params)
			if (id) 
			{
				let dict = {
		      		"_id" : id,
			    };
			    this.adminService.postData('getPackageById',dict).subscribe((response: any) => {
			      console.log("AGENTS = "+response.data);
			      
			      this.user = response.data;
			      this.name = response.data.name;
			      this.userId = response.data._id;
			      this.oldUser = Object.assign({}, this.user);
			      this.initUser();
				// 		this.initUser();
			      // if(response.status == 1){
			      //   this.pageData = response.data.data;
			      //   this.patchValues();
			      // }
			      
			    });
				// this.store.pipe(select(selectUserById(id))).subscribe(res => {
				// 	if (res) {
				// 		this.user = res;
				// 		this.rolesSubject.next(this.user.roles);
				// 		this.addressSubject.next(this.user.address);
				// 		this.soicialNetworksSubject.next(this.user.socialNetworks);
				// 		this.oldUser = Object.assign({}, this.user);
				// 		this.initUser();
				// 	}
				// });
			} else {
				this.user = new User();
				this.user.clear();
				this.rolesSubject.next(this.user.roles);
				//this.addressSubject.next(this.user.address);
				this.soicialNetworksSubject.next(this.user.socialNetworks);
				this.oldUser = Object.assign({}, this.user);
				this.initUser();
			}
		});
		this.subscriptions.push(routeSubscription);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Init user
	 */
	initUser() 
	{
		this.ngxService.start();
		this.createForm();
		if (!this.user.id) {
			this.subheaderService.setTitle('Create Package');
			this.subheaderService.setBreadcrumbs([
				// { title: 'Agent Management', page: `user-management` },
				{ title: 'Packages',  page: `user-management/packages` },
				{ title: 'Create Package', page: `user-management/packages/add` }
			]);
			
			return;
		}
		this.subheaderService.setTitle('Edit Package');
		this.subheaderService.setBreadcrumbs([
			// { title: 'Agent Management', page: `user-management` },
			{ title: 'Packages',  page: `user-management/packages` },
			{ title: 'Edit Package', page: `user-management/packages/edit`, queryParams: { id: this.user.id } }
		]);
		this.ngxService.stop();
	}

	/**
	 * Create form
	 */
	createForm() {
		let regexp = /^\S*$/;
		let regexpFullname = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
		let regexpUsername = /^([1-9][0-9]{,2}(,[0-9]{3})*|[0-9]+)(\.[0-9]{1,9})?$/;

		this.userForm = this.userFB.group({
			// username: [this.user.username, Validators.required, Validators.pattern(regexp)],
			name: [this.user.name, Validators.compose([
				Validators.required,
				Validators.pattern(regexpFullname)
				])
			],
			price: [this.user.price, Validators.compose([
				Validators.required,
				Validators.pattern(regexpUsername),
			])],
			// password: [this.user.password, Validators.required]
			description: [this.user.description, Validators.compose([
				Validators.required
				])
			],
			timePeriod: [this.user.timePeriod, Validators.compose([
				Validators.required
				]) ]
		});
		this.ngxService.stop();
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId()
	{
		const url = '/user-management/packages';
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshUser(isNew: boolean = false, id = 0) {
		let url = this.router.url;
		if (!isNew) {
			this.router.navigate([url], { relativeTo: this.activatedRoute });
			return;
		}

		url = `/user-management/packages/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

	/**
	 * Reset
	 */
	reset() {
		this.user = Object.assign({}, this.oldUser);
		this.createForm();
		this.hasFormErrors = false;
		this.userForm.markAsPristine();
  		this.userForm.markAsUntouched();
  		this.userForm.updateValueAndValidity();
	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}

		const editedUser = this.prepareUser();
		console.log(editedUser)
		if (editedUser.id != undefined)
		{
			this.updateUser(editedUser, withBack);
			return;
		}

		this.addUser(editedUser, withBack);
	}

	/**
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		_user.id 			= this.userId;
		_user.name 		= controls.name.value;
		_user.price 		= controls.price.value;
		_user.timePeriod 		= controls.timePeriod.value;
		_user.description 		= controls.description.value;
		return _user;
	}

	/**
	 * Add User
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	addUser(_user: User, withBack: boolean = true)
	{
		this.ngxService.start();
		let dict = {
          	"name"     		: _user.name,
          	"price"     	: _user.price,
          	"timePeriod"     	: _user.timePeriod,
          	"description"     	: _user.description,
      	};

      	this.adminService.postData('create_package',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
      			const message = `New Package has been added successfully.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Create);
				this.goBackWithId();
      		}
      		else
      		{
	          	const message = response.error;
				this.layoutUtilsService.showActionNotification(message, MessageType.Delete);
	        }
		});
	}

	/**
	 * Update user
	 *
	 * @param _user: User
	 * @param withBack: boolean
	 */
	updateUser(_user: User, withBack: boolean = false)
	{
		this.ngxService.start();
		let dict = {
	          "name"     		: _user.name,
          	"price"     	: _user.price,
          	"timePeriod"     	: _user.timePeriod,
          	"description"     	: _user.description,
	          "_id" 		: _user.id
	      	};

      	this.adminService.postData('updatePackage',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
				const message = 'Package details updated successfully.';
				this.layoutUtilsService.showActionNotification(message, MessageType.Update);
				this.goBackWithId();
			}else{
				const message = response.error;
				this.layoutUtilsService.showActionNotification(message, MessageType.Delete);
				// alert(response.error);
			}
		});
	}

	/**
	 * Returns component title
	 */
	getComponentTitle() 
	{
		const editedUser = this.prepareUser();
		console.log(editedUser)
		if (editedUser.id != undefined)
		{
			// let result = 'Edit Agent';
			// if (!this.user || !this.user.id) {
			// 	return result;
			// }

			// result = `Edit user - ${this.user.fullname}`;
			// return result;
			return "Edit Package";
		}
		else
		{
			// let result = 'Create Agent';
			// if (!this.user || !this.user.id) {
			// 	return result;
			// }

			// result = `Edit user - ${this.user.fullname}`;
			// return result;
			return "Create Package";
		}
	}

	/**
	 * Close Alert
	 *
	 * @param $event: Event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	submit() {
      const controls = this.userForm.controls;
      console.log(controls);
      /** check form */
      if (this.userForm.invalid)
      {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
        return;
      }
      this.ngxService.start();
      let dict = {
          "name"     		: controls.name.value,
          "username"     	: controls.username.value,
          "email"     		: controls.email.value,
          "password"     	: controls.password.value,
      };

      this.adminService.postData('addUser',dict).subscribe((response:any) => {
        console.log(response);
        this.ngxService.stop();
        if(response.status == 1){
          alert('Agent saved successfully.')
        }else{
          alert('Something went wrong, please try again.');
        }
      })
    };
}