import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurseurImageComponent } from './curseur-image.component';

describe('CurseurImageComponent', () => {
  let component: CurseurImageComponent;
  let fixture: ComponentFixture<CurseurImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurseurImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurseurImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
