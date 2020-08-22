import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolGridComponent } from './symbol-grid.component';

describe('SymbolGridComponent', () => {
  let component: SymbolGridComponent;
  let fixture: ComponentFixture<SymbolGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
