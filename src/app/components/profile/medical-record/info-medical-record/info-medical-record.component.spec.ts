import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMedicalRecordComponent } from './info-medical-record.component';

describe('InfoMedicalRecordComponent', () => {
  let component: InfoMedicalRecordComponent;
  let fixture: ComponentFixture<InfoMedicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMedicalRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
