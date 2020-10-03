import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
  selector: 'kt-edit-glossary',
  templateUrl: './edit-glossary.component.html',
  styleUrls: ['./edit-glossary.component.scss']
})

export class EditGlossaryComponent implements OnInit {
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
	selfImage1:any;
	selfImage11:any;
	selfImage:any = '';
	showError:any;
	imageSizeError:any;
	topic:any;
	defination:any;
	imageRequired: any = false;
	imagePath:any = 'http://3.136.84.42:3000/images/';
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
		           private ngxService: NgxUiLoaderService,
    				private changeDetection: ChangeDetectorRef) { }

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
			    this.adminService.postData('getGlossaryById',dict).subscribe((response: any) => {
			      console.log("GLOSSARY = "+response.data);
			      this.user = response.data;
			      this.userId = response.data._id;
			      this.topic 		= response.data.topic;
			      this.defination 	= response.data.defination;
			      this.oldUser = Object.assign({}, this.user);
			      this.initUser();
			    });
			} else {
				this.user = new User();
				this.user.clear();
				this.rolesSubject.next(this.user.roles);
				//this.addressSubject.next(this.user.address);
				this.soicialNetworksSubject.next(this.user.socialNetworks);
				this.oldUser = Object.assign({}, this.user);
				this.initUser();
				this.imageRequired = true;
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
		if (!this.user.id)
		{
			this.subheaderService.setTitle('Create Glossary');
			this.subheaderService.setBreadcrumbs([
				// { title: 'Agent Management', page: `user-management` },
				{ title: 'Glossary',  page: `user-management/glossary` },
				{ title: 'Create Glossary', page: `user-management/glossary/add` }
			]);
			
			return;
		}
		this.subheaderService.setTitle('Edit Glossary');
		this.subheaderService.setBreadcrumbs([
			// { title: 'Agent Management', page: `user-management` },
			{ title: 'Glossary',  page: `user-management/glossary` },
			{ title: 'Edit Glossary', page: `user-management/glossary/edit`, queryParams: { id: this.user.id } }
		]);
		this.ngxService.stop();
	}

	/**
	 * Create form
	 */
	createForm() {
		let regexp = /^\S*$/;
		let regexpFullname = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
		let regexpUsername = /^[0-9]*$/;
		const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
		this.userForm = this.userFB.group({
			// username: [this.user.username, Validators.required, Validators.pattern(regexp)],
			topic: [this.topic, Validators.compose([
				Validators.required
				])
			],
			defination: [this.defination, Validators.compose([
				Validators.required
			])]
		});
		this.ngxService.stop();
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId()
	{
		const url = '/user-management/glossary';
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

		url = `/user-management/glossary/edit/${id}`;
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
	 * Returns prepared data for save
	 */
	prepareUser(): User {
		const controls = this.userForm.controls;
		const _user = new User();
		_user.clear();
		_user.id 			= this.userId;
		_user.topic 		= controls.topic.value;
		_user.defination	= controls.defination.value;

		return _user;
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
			return "Edit Glossary";
		}
		else
		{
			return "Create Glossary";
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

	// sumbit() 
	// {
 //      	const controls = this.userForm.controls;
 //      	console.log(controls);
 //      	return false;
 //      	/** check form */
 //      	if (this.userForm.invalid)
 //      	{
 //        	Object.keys(controls).forEach(controlName =>
 //          		controls[controlName].markAsTouched()
 //        	);
 //        	return;
 //      	}
 //      	this.ngxService.start();
      
 //  		//-------------------------
	// 		const editedUser = this.prepareUser();
	// 		console.log(editedUser)
	// 		if (editedUser.id != undefined)
	// 		{
	// 			let dict = {
	// 	          	"topic"    		: _user.topic,
	// 	          	"defination"  	: _user.defination
	// 	      	};

	// 	      	this.adminService.postData('create_glossary',dict).subscribe((response:any) => {
	// 	      		this.ngxService.stop();
	// 	      		if(response.status == 1)
	// 	      		{
	// 	      			const message = `New glossary has been added successfully.`;
	// 					this.layoutUtilsService.showActionNotification(message, MessageType.Create);
	// 					this.goBackWithId();
	// 	      		}
	// 	      		else
	// 	      		{
	// 		          	const message = response.error;
	// 					this.layoutUtilsService.showActionNotification(message, MessageType.Delete);
	// 		        }
	// 			});
	// 		}
	// 		else
	// 		{
	// 			let dict = {
	// 				"topic"    		: _user.topic,
	// 	          	"defination"  	: _user.defination,
	// 				"_id" 			: _user.id
	//       		};

	// 	      	this.adminService.postData('updateGlossary',dict).subscribe((response:any) => {
	// 	      		this.ngxService.stop();
	// 	      		if(response.status == 1)
	// 	      		{
	// 					const message = 'Glossary details updated successfully.';
	// 					this.layoutUtilsService.showActionNotification(message, MessageType.Update);
	// 					this.goBackWithId();
	// 				}else{
	// 					const message = response.error;
	// 					this.layoutUtilsService.showActionNotification(message, MessageType.Delete);
	// 					// alert(response.error);
	// 				}
	// 			});
	// 		}
 //      	//-------------------------

 //    };

    onSumbit(withBack: boolean = false) {
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const editedUser = this.prepareUser();
		console.log(editedUser)
		if (editedUser.id != undefined)
		{
			this.updateUser(editedUser, withBack);
			// this.uploadImage(editedUser, withBack);
			return;
		}
		// this.uploadImage(editedUser, withBack);
		this.addUser(editedUser, withBack);
	}

    addUser(_user: User, withBack: boolean = true)
	{
		this.ngxService.start();
		let dict = {
	          	"topic"    		: _user.topic,
	          	"defination"  	: _user.defination
      	};

      	this.adminService.postData('create_glossary',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
      			const message = `New glossary has been added successfully.`;
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
			"topic"    		: _user.topic,
          	"defination"  	: _user.defination,
			"_id" 			: _user.id
  		};

      	this.adminService.postData('updateGlossary',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
				const message = 'Glossary details updated successfully.';
				this.layoutUtilsService.showActionNotification(message, MessageType.Update);
				this.goBackWithId();
			}else{
				const message = response.error;
				this.layoutUtilsService.showActionNotification(message, MessageType.Delete);
				// alert(response.error);
			}
		});
		// this.uploadImage();
	}

}
