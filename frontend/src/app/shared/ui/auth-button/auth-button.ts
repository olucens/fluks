import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.html',
  styleUrl: './auth-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthButton {
  readonly text = input.required<string>();
  readonly icon = input.required<string>();

  readonly clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
