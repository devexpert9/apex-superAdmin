import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSignupPackageComponent } from './edit-signup-package.component';

describe('EditSignupPackageComponent', () => {
  let component: EditSignupPackageComponent;
  let fixture: ComponentFixture<EditSignupPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSignupPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSignupPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
