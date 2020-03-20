import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SintSelectionComponent } from './sintSelection.component';

describe('SintSelectionComponent', () => {
  let component: SintSelectionComponent;
  let fixture: ComponentFixture<SintSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SintSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SintSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
