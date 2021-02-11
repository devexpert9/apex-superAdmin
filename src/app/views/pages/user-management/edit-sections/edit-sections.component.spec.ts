import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSectionsComponent } from './edit-sections.component';

describe('EditSectionsComponent', () => {
  let component: EditSectionsComponent;
  let fixture: ComponentFixture<EditSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
