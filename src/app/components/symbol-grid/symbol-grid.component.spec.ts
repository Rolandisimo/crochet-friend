import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SymbolGridComponent } from './symbol-grid.component';

describe('SymbolGridComponent', () => {
    let component: SymbolGridComponent;
    let fixture: ComponentFixture<SymbolGridComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SymbolGridComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SymbolGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
