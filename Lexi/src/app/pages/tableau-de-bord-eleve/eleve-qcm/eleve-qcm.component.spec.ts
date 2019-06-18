import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveQCMComponent } from './eleve-qcm.component';

describe('EleveQCMComponent', () => {
  let component: EleveQCMComponent;
  let fixture: ComponentFixture<EleveQCMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleveQCMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleveQCMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
