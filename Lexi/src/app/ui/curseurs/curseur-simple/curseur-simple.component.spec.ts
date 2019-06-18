import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseurSimpleComponent } from './curseur-simple.component';

describe('CurseurSimpleComponent', () => {
  let component: CurseurSimpleComponent;
  let fixture: ComponentFixture<CurseurSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurseurSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurseurSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
