import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseurTriangulaireComponent } from './curseur-triangulaire.component';

describe('CurseurTriangulaireComponent', () => {
  let component: CurseurTriangulaireComponent;
  let fixture: ComponentFixture<CurseurTriangulaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurseurTriangulaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurseurTriangulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
