import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'kt-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  selfImage1: any = '';
	selfImage: any = '';
	pageData: any;
	userForm: FormGroup;
	imageRequired: any = true;
	showError: any = false;
	hasFormErrors: any;
  	constructor( private layoutUtilsService: LayoutUtilsService, private ngxService: NgxUiLoaderService, private fb: FormBuilder, public route: ActivatedRoute, public adminService: AdminService, public router: Router, public changeDetection: ChangeDetectorRef) { }


  	ngOnInit()
  	{
  		this.initHomeForm();
    	this.getPageData();
  	}

  	onSumbit(){
  		this.hasFormErrors = false;
		const controls = this.userForm.controls;
		/** check form */
		if (this.userForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			// this.selectedTab = 0;
			return;
		}

		this.savePageData();
  	}

  	uploadImage()
    {	
    	this.ngxService.start();
    	if(this.selfImage != ""){
	      	const formData = new FormData()
	      	formData.append('image', this.selfImage, this.selfImage.name)
	      	this.adminService.postData('upload_image',formData).subscribe((response) => {
		        console.log(response);
		        this.selfImage1 = response;
		        this.selfImage = '';
		       	this.savePageData();
	      	})
	    }else{
	    	this.savePageData();
	    }
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
	    	this.imageRequired = true;
	      	this.selfImage1 = reader.result;
	      	 this.changeDetection.detectChanges();
	    };
	    reader.readAsDataURL(selectedFile);
  	}

  	getPageData()
  	{
	    
	    this.adminService.postData('getWebContactData',{}).subscribe((response: any) => {
	      console.log(response);
	      if(response.status == 1){

	        	if(response.data.image != '')
    			{	
    				this.imageRequired = false;
	    			this.selfImage1 = response.data.image;
	    			// document.getElementById('ban_img').setAttribute("src",'http://18.217.224.73:3000/images/'+response.data.image);
	    		}else{
	    			// document.getElementById('ban_img').setAttribute("src", '');
	    		}
	          this.userForm.patchValue({
	            news_description: response.data.newsletterDesc,
	            description: response.data.desc,
	            phone: response.data.phone,
	            email: response.data.email,
	            facebook: response.data.facebook,
	            google: response.data.google,
	            skype: response.data.skype,
	            instagram: response.data.instagram,
	            twitter: response.data.twitter,
	            linkedin: response.data.linkedin,
	            address: response.data.address,
	          });

	          this.changeDetection.detectChanges();
	        }
	      
	    });
  	}

  	initHomeForm()
    {
    	const fbRegex     =  /^(?:http(s)?:\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
     	const linkedRegex =  /^(?:http(s)?:\/\/)?(?:www.)?linkedin.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
     	const instaRegex  =  /^(?:http(s)?:\/\/)?(?:www.)?instagram.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
     	const pintrestRegex  =  /^(?:http(s)?:\/\/)?(?:www.)?pintrest.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
     	const googleRegex  =  /^(?:http(s)?:\/\/)?(?:www.)?google.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
     	const twitterRegex  =  /^(?:http(s)?:\/\/)?(?:www.)?twitter.com\/(?:(?:\w)*#!\/)?(?:[?\w\-]*\/)?([\w\-]*)?/;
	     // const contactRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
     	const contactRegex = /^[0-9]{5,10}$/;
     	const emailRegex   = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
     	
      	this.userForm = this.fb.group({
	        phone: ['', Validators.compose([Validators.required, Validators.pattern(contactRegex)]) ],
	        google: ['', Validators.compose([ Validators.pattern(googleRegex)])],
	        facebook: ['', Validators.compose([ Validators.pattern(fbRegex)])],
	        instagram: ['', Validators.compose([ Validators.pattern(instaRegex)])],
	        linkedin: ['', Validators.compose([ Validators.pattern(linkedRegex)])],
	        pintrest: ['', Validators.compose([ Validators.pattern(pintrestRegex)])],
	        twitter: ['', Validators.compose([ Validators.pattern(twitterRegex)])],
	        skype: [''],
	        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
	        description: ['', Validators.compose([Validators.required])],
	        address: ['', Validators.compose([Validators.required])],
	        news_description: ['', Validators.compose([Validators.required])],
      	});
      	//this.onChanges();
    }


    savePageData()
  	{
  		const controls = this.userForm.controls;
		let dict = {
			phone : controls.phone.value,
			desc : controls.description.value,
			newsletterDesc : controls.news_description.value,
			email : controls.email.value,
			address : controls.address.value,
			skype : controls.skype.value,
			facebook : controls.facebook.value,
			twitter : controls.twitter.value,
			instagram : controls.instagram.value,
			google : controls.google.value,
			pintrest : controls.pintrest.value,
			linkedin : controls.linkedin.value,
		};

	    this.adminService.postData('addWebContactData',dict).subscribe((response: any) => {
	      console.log(response);
	      this.ngxService.stop();
	      if(response.status == 1){
	        this.layoutUtilsService.showActionNotification('Page data saved successfully.', MessageType.Create);
	      }else{
	      	this.layoutUtilsService.showActionNotification('Something went wrong.Please try later.', MessageType.Delete);
	      }
	      
	    });
  	};


}
