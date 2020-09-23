import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
@Component({
  selector: 'kt-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.scss']
})
export class MyPageComponent implements OnInit {
  public tools: object = {
        items: [
               'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
               'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
               'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
               'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
               'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
               'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
       };
	homeForm: FormGroup;
    loading 	= false;
    errors: any = [];
    inquiries: any;
    type: any;
    pageData: any;
    selfImage: any = '';
    disabilityImage: any = '';
    propertyImage: any = '';
    selfImage1: any = '';
    disabilityImage1: any = '';
    propertyImage1: any = '';
    selfImage2: any = '';
    disabilityImage2: any = '';
    propertyImage2: any = '';
    showError: any;
  	constructor(private layoutUtilsService: LayoutUtilsService, private ngxService: NgxUiLoaderService, private fb: FormBuilder, public route: ActivatedRoute, public adminService: AdminService, public router: Router, public changeDetection: ChangeDetectorRef) { }


  	ngOnInit()
  	{
  		this.initHomeForm();
    	this.getPageData();
  	}

  	getPageData()
  	{
	    
	    this.adminService.postData('getCmsContent',{}).subscribe((response: any) => {
	      console.log(response);
	      if(response.status == 1){
	        this.pageData = response.data;
	        console.log(response.data);

	        this.patchValues(0);
	      }

        if(this.pageData.length > 0){
          this.homeForm.patchValue({
            selfHeadingCheckbox: this.pageData[0].selfHeadingCheckbox,
            disabilityHeadingCheckbox: this.pageData[0].disabilityHeadingCheckbox,
            propHeadingCheckbox: this.pageData[0].propHeadingCheckbox,
          });
        }
	      
	    });
  	}

  	initHomeForm()
    {
      	this.homeForm = this.fb.group({
      		template: ['version1'],
      		selfHeading: [''],
          selfHeadingCheckbox: [false],
          self_service_img: [''],
	        self_service: ['', Validators.compose([Validators.required])],
	        disabilityHeading: [''],
          disabilityHeadingCheckbox: [false],
          disability_img: [''],
	        disability: ['', Validators.compose([Validators.required])],
	        propHeading: [''],
          propHeadingCheckbox: [false],
          property_casuality_img: [''],
	        property_casuality: ['', Validators.compose([Validators.required])],
      	});
      	//this.onChanges();
    }

    patchValues(index)
    {	
    	if(this.pageData.length > 0){
    		this.homeForm.patchValue({
	        // self_service_img: this.pageData[index].self_service_image,
          selfHeading: this.pageData[0].selfHeading,
	        // selfHeadingCheckbox: this.pageData[0].selfHeadingCheckbox,
          self_service: this.pageData[index].selfservice_content,
	        // disability_img: this.pageData[index].disability_image,
          disabilityHeading: this.pageData[0].disabilityHeading,
	        // disabilityHeadingCheckbox: this.pageData[0].disabilityHeadingCheckbox,
          disability: this.pageData[index].disability_content,
	        // property_casuality_img: this.pageData[index].property_casuality_image,
          propHeading: this.pageData[0].propHeading,
	        // propHeadingCheckbox: this.pageData[0].propHeadingCheckbox,
          property_casuality: this.pageData[index].property_casuality_content
      	});

    		if(this.pageData[index].selfservice_image != '')
    		{
    			this.selfImage2 = this.pageData[index].selfservice_image;
    			document.getElementById('ban_img').setAttribute("src",'http://18.217.224.73:3000/images/'+this.pageData[index].selfservice_image);
    		}else{
    			document.getElementById('ban_img').setAttribute("src",'');
    		}
	      	
	      	if(this.pageData[index].disability_image != ''){
	      		this.disabilityImage2 = this.pageData[index].disability_image;
    			document.getElementById('ban_img1').setAttribute("src",'http://18.217.224.73:3000/images/'+this.pageData[index].disability_image);
    		}else{
    			document.getElementById('ban_img1').setAttribute("src",'');
    		}

    		if(this.pageData[index].property_casuality_image != ''){
    			this.propertyImage2 = this.pageData[index].property_casuality_image;
    			document.getElementById('ban_img2').setAttribute("src",'http://18.217.224.73:3000/images/'+this.pageData[index].property_casuality_image);
    		}else{
    			document.getElementById('ban_img2').setAttribute("src",'');
    		}
	      	
	      	
    	}
  	}

  	onChanges(): void {
  		
  	}

  	demo(version)
  	{
  		this.ngxService.start();
  		let self = this;
        
        // this.conditionalSections = response.data[0];

      	if(version == 'version1'){
      		self.patchValues(0);
      	}else if(version == 'version2'){
      		self.patchValues(0);
          // self.patchValues(1);
      	}else if(version == 'version3'){
      		// self.patchValues(2);
          self.patchValues(0);
      	}else if(version == 'version4'){
      		// self.patchValues(3);
          self.patchValues(0);
      	}
      	this.ngxService.stop();
  	}

    public onFileChanged(event, image) 
  	{
  		var selectedFile = event.target.files[0];
  		if(image == 'self_service'){
  			this.selfImage = selectedFile;
  		}else if(image == 'disability_img'){
  			this.disabilityImage = selectedFile;
  		}else if(image == 'property_casuality_img'){
  			this.propertyImage = selectedFile;
  		}
	    
	    //this.selectedFile = selectedFile;
	    this.showError = false;
	    // this.authForm.get('image').setValue(selectedFile);
	    console.log(event.target, event.target.files[0])
	    const reader = new FileReader();
	    reader.onload = () => {
	      // this.banner_image = reader.result;
	      	if(image == 'self_service'){
	  			this.selfImage1 = reader.result;
	  		}else if(image == 'disability_img'){
	  			this.disabilityImage1 = reader.result;
	  		}else if(image == 'property_casuality_img'){
	  			this.propertyImage1 = reader.result;
	  		}
	    };
	    reader.readAsDataURL(selectedFile);
  	}

    submit()
    {
      	const controls = this.homeForm.controls;
      	// console.log(controls);
      	/** check form */
      	if (this.homeForm.invalid)
      	{
	        Object.keys(controls).forEach(controlName =>
	          controls[controlName].markAsTouched()
	        );
	        return;
      	}

      	this.ngxService.start();
      	this.uploadImage(0);
      	
    };

    saveContent(){
    	const controls = this.homeForm.controls;
    	let dict = {
  			// "template"        			     : controls.template.value,
        "template"                   : 'version1',
  			"selfHeading" 		           : controls.selfHeading.value,
        "selfservice_image"          : this.selfImage2,
  			"selfservice_content"  	     : controls.self_service.value,
        "disabilityHeading"          : controls.disabilityHeading.value,
  			"disability_image"     		   : this.disabilityImage2,
  			"disability_content"   		   : controls.disability.value,
  			"propHeading"                : controls.propHeading.value,
        "property_casuality_image"   : this.propertyImage2,
  			"property_casuality_content" : controls.property_casuality.value,
        "propHeadingCheckbox"        : controls.propHeadingCheckbox.value,
        "disabilityHeadingCheckbox"  : controls.disabilityHeadingCheckbox.value,
        "selfHeadingCheckbox"        : controls.selfHeadingCheckbox.value,
      };

      	console.log(dict);
      	this.adminService.postData('addCmsContent', dict).subscribe((response:any) => {
	        console.log(response);
	        this.ngxService.stop();
	        if(response.status == 1){
	          
	          const message = `Page content has been updated successfully.`;
	          this.layoutUtilsService.showActionNotification(message, MessageType.Create);
	          // this.goBackWithId();
	        }else{
	          const message = `Page content has been updated successfully.`;
	          this.layoutUtilsService.showActionNotification(message, MessageType.Create);
	        }
      	})
    }

    uploadImage(counter){
    	if(counter < 3){
    		if(counter == 0){
    			if(this.selfImage != ""){
			      	const formData = new FormData()
			      	formData.append('image', this.selfImage, this.selfImage.name)
			      	this.adminService.postData('upload_image',formData).subscribe((response) => {
				        console.log(response);
				        this.selfImage2 = response;
				        
				        this.uploadImage(1);
			      	})
			    }else{
			    	this.uploadImage(1);
			    }
		    }else if(counter == 1){
		    	if(this.disabilityImage != ""){
			      	const formData = new FormData()
			      	formData.append('image', this.disabilityImage, this.disabilityImage.name)
			      	this.adminService.postData('upload_image',formData).subscribe((response) => {
				        console.log(response);
				        this.disabilityImage2 = response
				        
				        this.uploadImage(2);
			      	})
			    }else{
			    	this.uploadImage(2);
			    }
		    }else if(counter == 2){
		    	if(this.propertyImage != ""){
			      	const formData = new FormData()
			      	formData.append('image', this.propertyImage, this.propertyImage.name)
			      	this.adminService.postData('upload_image',formData).subscribe((response) => {
				        console.log(response);
				        this.propertyImage2 = response
				        
				        this.uploadImage(3);
			      	})
			    }else{
			    	this.uploadImage(3);
			    }
		    }
    	}else{
    		this.saveContent();
    	}
    }
}
