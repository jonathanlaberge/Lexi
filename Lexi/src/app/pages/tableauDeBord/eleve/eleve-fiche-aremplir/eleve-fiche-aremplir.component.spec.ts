import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleveFicheARemplirComponent } from './eleve-fiche-aremplir.component';

describe('EleveFicheARemplirComponent', () => {
  let component: EleveFicheARemplirComponent;
  let fixture: ComponentFixture<EleveFicheARemplirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleveFicheARemplirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleveFicheARemplirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
