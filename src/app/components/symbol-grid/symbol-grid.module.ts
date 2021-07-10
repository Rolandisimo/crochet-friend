import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SymbolGridComponent } from './symbol-grid.component';

@NgModule({
    declarations: [SymbolGridComponent],
    imports: [CommonModule],
    exports: [SymbolGridComponent],
})
export class SymbolGridModule {}
