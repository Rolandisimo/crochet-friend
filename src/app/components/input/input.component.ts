import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

export type InputType = 'text' | 'number' | 'email' | 'file';
// TODO: Might not need this
@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
    @Input() type: InputType = 'text';
    @Output() keyUp = new EventEmitter<string>();
    @Output() blurEmitter = new EventEmitter<string>();

    @ViewChild('input') input?: ElementRef<HTMLInputElement>;

    constructor() {}

    ngOnInit(): void {}

    keyUpHandler(value: string): void {
        this.keyUp.emit(value);
    }

    blurHandler(value: string): void {
        this.blurEmitter.emit(value);
    }
}
