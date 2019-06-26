import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCMModificationFicheComponent } from './qcmmodification-fiche.component';

describe('QCMModificationFicheComponent', () => {
  let component: QCMModificationFicheComponent;
  let fixture: ComponentFixture<QCMModificationFicheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCMModificationFicheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCMModificationFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
