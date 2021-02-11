import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LayoutUtilsService, MessageType, QueryParamsModel } from '../../../core/_base/crud';

@Component({
  selector: 'kt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    homeForm: FormGroup;
    loading 	= false;
    errors: any = [];
    inquiries: any;
    type: any;
    passwordErr: any;
    c_passwordErr: any;

  	constructor(private layoutUtilsService: LayoutUtilsService, private ngxService: NgxUiLoaderService, private fb: FormBuilder, public route: ActivatedRoute, public adminService: AdminService, public router: Router, public changeDetection: ChangeDetectorRef) { }

  	ngOnInit() 
  	{
  		this.initHomeForm();
 	  }

 	  initHomeForm()
    {
      let profile = JSON.parse(localStorage.getItem('profileData'));

      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      const nameRegx = /(^\w+)\s?/;
      const contactRegex = /^\(\d{3}\) \d{3}-?\d{4}$/;

      this.homeForm = this.fb.group({
        fname: [profile.firstname, Validators.compose([Validators.required, Validators.pattern(nameRegx)])],
        lname: [profile.lastname, Validators.compose([Validators.required, Validators.pattern(nameRegx)])],
        email: [profile.email, Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        contact: [profile.contact, Validators.compose([Validators.required, Validators.pattern(contactRegex)])],
        password: [''],
        c_password: [''],
      });
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

      if(controls.password.value != '')
      {
        let regexp = /^\S*$/;

        if(!regexp.test(controls.password.value) || controls.password.value.length < 6)
        {
          this.passwordErr = true;
          return;
        }
        else if(controls.password.value != controls.c_password.value){
          this.c_passwordErr = true;
          this.passwordErr = false;
          return;
        }
      }
      this.passwordErr = false;
      this.c_passwordErr = false;
        this.ngxService.start();
      //}

      let profile = JSON.parse(localStorage.getItem('profileData'));

      let dict = {
          "id"        : localStorage.getItem('userId'),
          "firstname" : controls.fname.value,
          "lastname"  : controls.lname.value,
          "email"     : controls.email.value,
          "password"  : controls.password.value == '' ? profile.password : controls.password.value,
          "contact"   : controls.contact.value,
          "image"     : 'https://cdn.pixabay.com/photo/2015/03/04/22/35/head-659651_960_720.png',
      };

      console.log(dict);
      this.adminService.postData('update_admin_profile',dict).subscribe((response:any) => {
        console.log(response);
        this.ngxService.stop();
        if(response.status == 1){
          localStorage.setItem('profileData', JSON.stringify(dict));
          // alert('Profile updated successfully.')
          const message = `Your information has been saved successfully.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Create);
          this.homeForm.patchValue({
            password: '',
            c_password: '',
          });
          // this.goBackWithId();
        }else{
          const message = `Your information has been saved successfully.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Create);
        }
      })
    };
}
