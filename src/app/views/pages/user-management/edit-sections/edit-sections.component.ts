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
  selector: 'kt-edit-sections',
  templateUrl: './edit-sections.component.html',
  styleUrls: ['./edit-sections.component.scss']
})

export class EditSectionsComponent implements OnInit {

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
	selfImage2: any = '';
	selfImage1:any;
	selfImage:any = '';
	showError:any;
	imageSizeError:any;
	imageRequired: any = false;
	imagePath:any = 'https://apex-4u.com:8080/images/';
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
			    this.adminService.postData('getSectionById',dict).subscribe((response: any) => {
			      console.log("SECTIONS = "+response.data);
			      
			      this.user 	= response.data;
			      this.name 	= response.data.name;
			      this.userId 	= response.data._id;
			      this.oldUser 	= Object.assign({}, this.user);
			      this.initUser();
			      this.selfImage2 = response.data.image;
			      this.selfImage1 = '';//response.data.image;
			      this.imageRequired = false;
 
			      document.getElementById('ban_img').setAttribute("src",'https://apex-4u.com:8080/images/'+ this.selfImage2);
			    });
			} else {
				this.user = new User();
				this.user.clear();
				this.rolesSubject.next(this.user.roles);
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
			this.subheaderService.setTitle('Create Section');
			this.subheaderService.setBreadcrumbs([
				// { title: 'Agent Management', page: `user-management` },
				{ title: 'Section',  page: `user-management/sections` },
				{ title: 'Create Section', page: `user-management/sections/add` }
			]);
			
			return;
		}
		this.subheaderService.setTitle('Edit Section');
		this.subheaderService.setBreadcrumbs([
			// { title: 'Agent Management', page: `user-management` },
			{ title: 'Section',  page: `user-management/sections` },
			{ title: 'Edit Section', page: `user-management/sections/edit`, queryParams: { id: this.user.id } }
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
			name: [this.name, Validators.compose([
				Validators.required,
				Validators.pattern(regexpFullname)
				])
			],
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
		const url = '/user-management/sections';
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

		url = `/user-management/sections/edit/${id}`;
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
	    this.showError = false;

	    console.log(event.target, event.target.files[0])
	    const reader = new FileReader();

	    // reader.onload = () => {
	    //   this.selfImage1 = reader.result;
	    // };
	    let file = event.target.files[0]; 
	    const img = new Image();
	    img.src = window.URL.createObjectURL( file );

	    reader.onload = () => {

			const width   = img.naturalWidth;
			const height  = img.naturalHeight;

			window.URL.revokeObjectURL( img.src );

			if( width != 400 && height != 400 ) 
			{
				this.imageSizeError = "Image should have dimentions 400 x 400 size";
				this.changeDetection.detectChanges();
				return false;
			}
			else{
				this.imageSizeError = "";
				this.selfImage1 = reader.result;
				this.changeDetection.detectChanges();
				console.log(this.selfImage1)  
			}
		};

	    reader.readAsDataURL(selectedFile);
  	}

	/**
	 * Save data
	 *
	 * @param withBack: boolean
	 */
	onSumbit(withBack: boolean = false) 
	{
		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) 
		{
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
		_user.name 			= controls.name.value;
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
          	"message"     	: _user.message,
          	"image"     	: this.selfImage1,
      	};

      	this.adminService.postData('create_section',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
      			const message = `New section has been added successfully.`;
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

	      console.log(this.selfImage2);
	      this.ngxService.start();
		// this.ngxService.start();
		let dict = {
          	"name"     		: _user.name,
          	"message"     	: _user.message,
          	"image"     	: this.selfImage1 == '' ? this.selfImage2 : this.selfImage1,
          	"_id" 			: _user.id
      	};

      	this.adminService.postData('updateSection',dict).subscribe((response:any) => {
      		this.ngxService.stop();
      		if(response.status == 1)
      		{
				const message = 'Section details updated successfully.';
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
			return "Edit Section Content";
		}
		else
		{
			// let result = 'Create Agent';
			// if (!this.user || !this.user.id) {
			// 	return result;
			// }

			// result = `Edit user - ${this.user.fullname}`;
			// return result;
			return "Create Section";
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


    updateContent(image)
    {
    	const controls = this.userForm.controls;
    	let dict = {
          "name"     	: controls.name.value,
          "message"     : controls.message.value,
          "image"     	: this.selfImage1,
          "id": this.user.id
      };

      this.adminService.postData('create_section',dict).subscribe((response:any) => {
        console.log(response);
        this.ngxService.stop();
        if(response.status == 1){
          alert('Section saved successfully.')
        }else{
          alert('Something went wrong, please try again.');
        }
      })
    }

    uploadImage(editedUser, withBack)
    {
    	if(this.selfImage != "")
    	{
    		this.ngxService.start();
	      	const formData = new FormData()
	      	formData.append('image', this.selfImage, this.selfImage.name)
	      	this.adminService.postData('upload_image',formData).subscribe((response) => {
		        console.log(response);
		        this.ngxService.stop();
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