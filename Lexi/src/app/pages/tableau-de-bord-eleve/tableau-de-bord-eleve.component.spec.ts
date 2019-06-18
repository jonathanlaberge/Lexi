import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauDeBordEleveComponent } from './tableau-de-bord-eleve.component';

describe('TableauDeBordEleveComponent', () => {
  let component: TableauDeBordEleveComponent;
  let fixture: ComponentFixture<TableauDeBordEleveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableauDeBordEleveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauDeBordEleveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
