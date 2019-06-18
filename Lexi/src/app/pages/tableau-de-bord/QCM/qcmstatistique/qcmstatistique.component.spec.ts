import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCMStatistiqueComponent } from './qcmstatistique.component';

describe('QCMStatistiqueComponent', () => {
  let component: QCMStatistiqueComponent;
  let fixture: ComponentFixture<QCMStatistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCMStatistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCMStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
