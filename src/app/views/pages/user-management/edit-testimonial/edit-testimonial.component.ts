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
  selector: 'kt-edit-testimonial',
  templateUrl: './edit-testimonial.component.html',
  styleUrls: ['./edit-testimonial.component.scss']
})
export class EditTestimonialComponent implements OnInit {

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
	selfImage:any = '';
	showError:any;
	imageRequired: any = false;
	imagePath:any = 'http://18.217.224.73:3000/images/';
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
			    this.adminService.postData('getTestimonialById',dict).subscribe((response: any) => {
			      console.log("AGENTS = "+response.data);
			      
			      this.user = response.data;
			      this.name = response.data.name;
			      this.userId = response.data._id;
			      this.oldUser = Object.assign({}, this.user);
			      this.initUser();
			      this.selfImage1 = response.data.image;
			      document.getElementById('ban_img').setAttribute("src",'http://18.217.224.73:3000/images/'+ this.selfImage1);
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
				this.addressSubject.next(this.user.address);
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
		if (!this.user.id) {
			this.subheaderService.setTitle('Create Testimonial');
			this.subheaderService.setBreadcrumbs([
				// { title: 'Agent Management', page: `user-management` },
				{ title: 'Testimonial',  page: `user-management/testimonials` },
				{ title: 'Create Testimonial', page: `user-management/testimonials/add` }
			]);
			
			return;
		}
		this.subheaderService.setTitle('Edit Testimonial');
		this.subheaderService.setBreadcrumbs([
			// { title: 'Agent Management', page: `user-management` },
			{ title: 'Testimonial',  page: `user-management/testimonials` },
			{ title: 'Edit Testimonial', page: `user-management/testimonials/edit`, queryParams: { id: this.user.id } }
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

		this.userForm = this.userFB.group({
			// username: [this.user.username, Validators.required, Validators.pattern(regexp)],
			name: [this.name, Validators.compose([
				Validators.required,
				Validators.pattern(regexpFullname)
				])
			],
			position: [this.user.position, Validators.compose([
				Validators.required,
			])],
			// password: [this.user.password, Validators.required]
			message: [this.user.message, Validators.compose([
				Validators.required
				])
			],
			image: ['']
		});
		this.ngxService.stop();
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId()
	{
		const url = '/user-management/testimonials';
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

		url = `/user-management/testimonials/edit/${id}`;
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

	public onFileChanged(event, image) 
  	{
  		var selectedFile = event.target.files[0];
  		
  		this.selfImage = selectedFile;
	    
	    //this.selectedFile = selectedFile;
	    this.showError = false;
	    // this.authForm.get('image').setValue(selectedFile);
	    console.log(event.target, event.target.files[0])
	    const reader = new FileReader();
	    reader.onload = () => {
	      this.selfImage1 = reader.result;
	    };
	    reader.readAsDataURL(selectedFile);
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

			if(this.imageRequired && this.selfImage == ''){
				this.showError = true;
				// return;
			}else{
				this.showError = false;
				this.imageRequired = false;
			}
			return;
		}
		console.log(this.imageRequired);
		if(this.imageRequired && this.selfImage == ''){
			this.showError = true;
			return;
		}else{
			this.showError = false;
			this.imageRequired = false;
		}

		const editedUser = this.prepareUser();
		console.log(editedUser)
		if (editedUser.id != undefined)
		{
			// this.updateUser(editedUser, withBack);
			this.uploadImage(editedUser, withBack);
			return;
		}
		this.uploadImage(editedUser, withBack);
		// this.addUser(editedUser, withBack);
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
		_user.position 		= controls.position.value;
		_user.message 		= controls.message.value;
		_user.image 		= controls.image.value;
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
          	"position"     	: _user.position,
          	"message"     	: _user.message,
          	"image"     	: this.selfImage1,
      	};

      	this.adminService.postData('create_testimonial',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
      			const message = `New testimonial has been added successfully.`;
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
		// this.ngxService.start();
		let dict = {
	          "name"     		: _user.name,
          	"position"     	: _user.position,
          	"message"     	: _user.message,
          	"image"     	: this.selfImage1,
	          "_id" 		: _user.id
	      	};

      	this.adminService.postData('updateTestimonial',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
				const message = 'Testimonial details updated successfully.';
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
			return "Edit Testimonial";
		}
		else
		{
			// let result = 'Create Agent';
			// if (!this.user || !this.user.id) {
			// 	return result;
			// }

			// result = `Edit user - ${this.user.fullname}`;
			// return result;
			return "Create Testimonial";
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

	submit() 
	{
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
          "position"     	: controls.position.value,
          "message"     		: controls.message.value,
          "image"     	: controls.image.value,
      };

      this.adminService.postData('create_testimonial',dict).subscribe((response:any) => {
        console.log(response);
        this.ngxService.stop();
        if(response.status == 1){
          alert('Testimonial saved successfully.')
        }else{
          alert('Something went wrong, please try again.');
        }
      })
      // this.uploadImage();
    };

    // saveContent(image)
    // {
    // 	let dict = {
    //       "name"     		: controls.name.value,
    //       "position"     	: controls.position.value,
    //       "message"     		: controls.message.value,
    //       "image"     	: this.selfImage1,
    //   };

    //   this.adminService.postData('create_testimonial',dict).subscribe((response:any) => {
    //     console.log(response);
    //     this.ngxService.stop();
    //     if(response.status == 1){
    //       alert('Testimonial saved successfully.')
    //     }else{
    //       alert('Something went wrong, please try again.');
    //     }
    //   })
    // }

    updateContent(image)
    {
    	const controls = this.userForm.controls;
    	let dict = {
          "name"     		: controls.name.value,
          "position"     	: controls.position.value,
          "message"     		: controls.message.value,
          "image"     	: this.selfImage1,
          "id": this.user.id
      };

      this.adminService.postData('create_testimonial',dict).subscribe((response:any) => {
        console.log(response);
        this.ngxService.stop();
        if(response.status == 1){
          alert('Testimonial saved successfully.')
        }else{
          alert('Something went wrong, please try again.');
        }
      })
    }

    uploadImage(editedUser, withBack)
    {
    	if(this.selfImage != ""){
	      	const formData = new FormData()
	      	formData.append('image', this.selfImage, this.selfImage.name)
	      	this.adminService.postData('upload_image',formData).subscribe((response) => {
		        console.log(response);
		        this.selfImage1 = response;
		        this.selfImage = '';
		       if (editedUser.id != undefined)
				{
					this.updateUser(editedUser, withBack);
				}
				else
				{
					this.addUser(editedUser, withBack);
				}
	      	})
	    }else{
	    	if (editedUser.id != undefined)
				{
					this.updateUser(editedUser, withBack);
				}
				else
				{
					this.addUser(editedUser, withBack);
				}
	    }
    }
}