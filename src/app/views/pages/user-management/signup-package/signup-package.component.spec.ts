import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPackageComponent } from './signup-package.component';

describe('SignupPackageComponent', () => {
  let component: SignupPackageComponent;
  let fixture: ComponentFixture<SignupPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
