import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlossaryComponent } from './edit-glossary.component';

describe('EditGlossaryComponent', () => {
  let component: EditGlossaryComponent;
  let fixture: ComponentFixture<EditGlossaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGlossaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
