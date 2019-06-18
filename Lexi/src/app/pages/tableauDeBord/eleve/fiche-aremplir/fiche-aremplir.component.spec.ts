import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheARemplirComponent } from './fiche-aremplir.component';

describe('FicheARemplirComponent', () => {
  let component: FicheARemplirComponent;
  let fixture: ComponentFixture<FicheARemplirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheARemplirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheARemplirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
