import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedDiagnosticComponent } from './guided-diagnostic.component';

describe('GuidedDiagnosticComponent', () => {
  let component: GuidedDiagnosticComponent;
  let fixture: ComponentFixture<GuidedDiagnosticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidedDiagnosticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedDiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
