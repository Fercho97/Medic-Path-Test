import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMedicComponent } from './info-medic.component';

describe('InfoMedicComponent', () => {
  let component: InfoMedicComponent;
  let fixture: ComponentFixture<InfoMedicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMedicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMedicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
