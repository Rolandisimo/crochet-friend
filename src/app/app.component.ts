import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crochet-friend';

  onBlur(): void {
    console.log('Blur');
  }

  onKeyUp(value: string): void {
    console.log('APP onKeyUp', value);
  }
}
