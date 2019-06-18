import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCMCreationComponent } from './qcmcreation.component';

describe('QCMCreationComponent', () => {
  let component: QCMCreationComponent;
  let fixture: ComponentFixture<QCMCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCMCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCMCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
