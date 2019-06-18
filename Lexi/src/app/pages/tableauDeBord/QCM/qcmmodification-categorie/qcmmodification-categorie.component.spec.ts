import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCMModificationCategorieComponent } from './qcmmodification-categorie.component';

describe('QCMModificationCategorieComponent', () => {
  let component: QCMModificationCategorieComponent;
  let fixture: ComponentFixture<QCMModificationCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCMModificationCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCMModificationCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
