import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCMCreationCategorieComponent } from './qcmcreation-categorie.component';

describe('QCMCreationCategorieComponent', () => {
  let component: QCMCreationCategorieComponent;
  let fixture: ComponentFixture<QCMCreationCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCMCreationCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCMCreationCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
