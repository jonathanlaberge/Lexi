import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseurCirculaireComponent } from './curseur-circulaire.component';

describe('CurseurCirculaireComponent', () => {
  let component: CurseurCirculaireComponent;
  let fixture: ComponentFixture<CurseurCirculaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurseurCirculaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurseurCirculaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
