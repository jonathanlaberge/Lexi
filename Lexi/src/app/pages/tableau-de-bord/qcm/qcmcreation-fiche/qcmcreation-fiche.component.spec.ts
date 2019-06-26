import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCMCreationFicheComponent } from './qcmcreation-fiche.component';

describe('QCMCreationFicheComponent', () => {
  let component: QCMCreationFicheComponent;
  let fixture: ComponentFixture<QCMCreationFicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCMCreationFicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCMCreationFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
