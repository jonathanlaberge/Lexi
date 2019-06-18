import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveHistoriqueComponent } from './eleve-historique.component';

describe('EleveHistoriqueComponent', () => {
  let component: EleveHistoriqueComponent;
  let fixture: ComponentFixture<EleveHistoriqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleveHistoriqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleveHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
