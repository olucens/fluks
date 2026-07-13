import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../shared/auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  readonly email = signal('');
  readonly success = signal(false);
  errorMessage = '';
  private authService = inject(AuthService);

  async resetPassword(): Promise<void> {
    const {error} = await this.authService.resetPassword(this.email());

    if (error) {
      this.errorMessage = error.message;
      return;
    }

    this.errorMessage = '';

    this.success.set(true);
  }
}
