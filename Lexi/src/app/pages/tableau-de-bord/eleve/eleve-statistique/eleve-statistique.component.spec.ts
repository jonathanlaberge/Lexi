import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveStatistiqueComponent } from './eleve-statistique.component';

describe('EleveStatistiqueComponent', () => {
  let component: EleveStatistiqueComponent;
  let fixture: ComponentFixture<EleveStatistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleveStatistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleveStatistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
