// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { AppState } from '../../../../../core/reducers';
// Layout
import { SubheaderService, LayoutConfigService } from '../../../../../core/_base/layout';
import { LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';

import { AdminService } from '../../../../../services/admin.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
} from '../../../../../core/auth';

@Component({
	selector: 'kt-user-edit',
	templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit, OnDestroy {
	// Public properties
	user: User;
	userId$: Observable<number>;
	oldUser: User;
	userId: any;
	reg_date: any = '';
	pageType: any;
	name: any;
	todaydate:any='';
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
		this.todaydate = new Date();
		this.ngxService.start();
		// this.loading$ = this.store.pipe(select(selectUsersActionLoading));
		const routeSubscription =  this.activatedRoute.params.subscribe(params => {
			const id = params.id;
			console.log(params)
			if (id) 
			{
				let dict = {
		      		"id" : id,
			    };
			    this.adminService.postData('getUserByID',dict).subscribe((response: any) => {
			      console.log("AGENTS = "+response.data);
			      
			      this.user = response.data;
			      this.name = response.data.name;
			      this.reg_date = response.data.created_on;
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
				// this.addressSubject.next(this.user.address);
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
			this.subheaderService.setTitle('Create Agent');
			this.subheaderService.setBreadcrumbs([
				{ title: 'Agent Management', page: `user-management` },
				{ title: 'Agents',  page: `user-management/users` },
				{ title: 'Create Agent', page: `user-management/users/add` }
			]);
			
			return;
		}
		this.subheaderService.setTitle('Edit Agent');
		this.subheaderService.setBreadcrumbs([
			{ title: 'Agent Management', page: `user-management` },
			{ title: 'Agents',  page: `user-management/users` },
			{ title: 'Edit Agent', page: `user-management/users/edit`, queryParams: { id: this.user.id } }
		]);
		this.ngxService.stop();
	}

	/**
	 * Create form
	 */
	createForm() {
		let regexp = /^\S*$/;
		// let regexpFullname = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
		let regexpFullname = /^[^\s]+[-a-zA-Z\s]+([-a-zA-Z]+)*$/;
		let regexpUsername = /^[A-Za-z]+$/;
		const contactRegex = /^\(\d{3}\) \d{3}-?\d{4}$/;
		// const contactRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
		const zipRegex = /^[0-9]{4,8}$/;
		this.userForm = this.userFB.group({
			// username: [this.user.username, Validators.required, Validators.pattern(regexp)],
			fullname: [this.name, Validators.compose([
				Validators.required,
				Validators.pattern(regexpFullname)
				])
			],
			email: [this.user.email, Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])],
			// password: [this.user.password, Validators.required]
			password: [this.user.password, Validators.compose([
				Validators.required,
				Validators.pattern(regexp),
				Validators.minLength(6),
				Validators.maxLength(15)
				])
			],
			username: [this.user.username, Validators.compose([
				Validators.required,
				Validators.pattern(regexpUsername),
				Validators.minLength(6),
				Validators.maxLength(15)
				])
			],
	        contact: [this.user.contact, Validators.compose([
	        	Validators.required, 
	        	Validators.pattern(contactRegex)])
	        ],
	        zip: [this.user.zip, Validators.compose([
	        	Validators.required, 
	        	Validators.pattern(zipRegex)])
	        ],
	        city: [this.user.city, Validators.compose([
	        	Validators.required])
	        ],
	        state: [this.user.state, Validators.compose([
	        	Validators.required])
	        ],
	        address: [this.user.address, Validators.compose([
	        	Validators.required])
	        ],
	        expiry_date: [this.user.expiry_date, Validators.compose([
	        	Validators.required])
	        ],
		});
		this.ngxService.stop();
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId()
	{
		const url = '/user-management/users';
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

		url = `/user-management/users/edit/${id}`;
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
		_user.username 		= controls.username.value;
		_user.email 		= controls.email.value;
		_user.fullname 		= controls.fullname.value;
		_user.password 		= controls.password.value;
		_user.zip 			= controls.zip.value;
		// _user.country 		= "";
		_user.state 		= controls.state.value;
		_user.city 			= controls.city.value;
		_user.address 		= controls.address.value;
		_user.contact 		= controls.contact.value;
		_user.expiry_date 	= controls.expiry_date.value == 'undefined' ? new Date() : controls.expiry_date.value;
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

		let d = new Date();
			d.setDate(d.getDate() + Number(30));
		let expiry_date = d; 

		let dict = {
          	"name"     		: _user.fullname,
          	"username"     	: _user.username,
          	"email"     	: _user.email,
          	"password"     	: _user.password,
          	"contact"     	: _user.contact,
          	"zip"     		: _user.zip,
          	"state"     	: _user.state,
          	"city"     		: _user.city,
          	"country"     	: "",
          	"address"     	: _user.address,
          	"expiry_date"   : _user.expiry_date,
      	};

      	this.adminService.postData('addUser',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
      			const message = `New agent has been added successfully.`;
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
	          	"name"     		: _user.fullname,
	          	"username"    	: _user.username,
	          	"email"     	: _user.email,
	          	"password"    	: _user.password,
	          	"_id" 			: _user.id,
	          	"contact"     	: _user.contact,
          		"zip"     		: _user.zip,
          		"state"     	: _user.state,
          		"city"     		: _user.city,
          		"country"     	: "",
          		"address"     	: _user.address,
          		"created_on"	: new Date(),
          		"expiry_date"   : _user.expiry_date
	      	};

      	this.adminService.postData('update_user',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
				const message = 'Agent details updated successfully.';
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
			return "Edit Agent";
			this.pageType = "Edit";
		}
		else
		{
			// let result = 'Create Agent';
			// if (!this.user || !this.user.id) {
			// 	return result;
			// }

			// result = `Edit user - ${this.user.fullname}`;
			// return result;
			return "Create Agent";
			this.pageType = "Create";
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
