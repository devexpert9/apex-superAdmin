// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
//import { MyPageComponent } from './my-page/my-page.component';
import { AdminService } from '../../services/admin.service';
import { AgentsComponent } from './agents/agents.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
//import { MatTableModule } from '@angular/material/table'  

@NgModule({
  declarations: [ AgentsComponent, SettingsComponent],
  exports: [],
  imports: [
    CommonModule,
   // MatTableModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    PartialsModule,
    MailModule,
    ECommerceModule,
    UserManagementModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AdminService]
})
export class PagesModule {
}
