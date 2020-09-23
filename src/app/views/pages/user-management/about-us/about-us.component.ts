import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../../core/_base/crud';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'kt-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

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

		this.uploadImage();
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
	    
	    this.adminService.postData('getWebAboutData',{}).subscribe((response: any) => {
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
	            tagline: response.data.heading,
	            description: response.data.content,
	          });
	        }
	      
	    });
  	}

  	initHomeForm()
    {
      	this.userForm = this.fb.group({
	        tagline: ['', Validators.compose([Validators.required])],
	        privacy_image: [''],
	        description: ['', Validators.compose([Validators.required])]
      	});
      	//this.onChanges();
    }


    savePageData()
  	{
  		const controls = this.userForm.controls;
		let dict = {
			heading: controls.tagline.value,
			content: controls.description.value,
			image: this.selfImage1
		};

	    this.adminService.postData('addWebAboutData',dict).subscribe((response: any) => {
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
