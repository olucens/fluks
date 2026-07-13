import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {CanComponentDeactivate} from '../../../core/guards/unsaved-changes-guard';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  styleUrl: '../shared/auth.scss',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword implements CanComponentDeactivate {
  readonly password = signal('');
  readonly confirmPassword = signal('');
  readonly success = signal(false);
  errorMessage = '';
  readonly passwordError = computed(() => {
    if (!this.password()) {
      return 'Password is required';
    }

    if (this.password().length < 6) {
      return 'Minimum 6 characters';
    }

    return null;
  });

  readonly confirmPasswordError = computed(() => {
    if (!this.confirmPassword()) {
      return 'Please confirm password';
    }

    if (this.password() !== this.confirmPassword()) {
      return 'Passwords do not match';
    }

    return null;
  });
  private authService = inject(AuthService);
  private router = inject(Router);

  canDeactivate(): boolean {
    console.log('canDeactivate called');
    if (this.success()) {
      return true;
    }

    if (this.password() || this.confirmPassword()) {
      return confirm('You have unsaved changes. Leave page?');
    }

    return true;
  }

  async changePassword(): Promise<void> {
    if (this.passwordError() || this.confirmPasswordError()) {
      return;
    }

    const {error} = await this.authService.updatePassword(this.password());

    if (error) {
      this.errorMessage = error.message;
      return;
    }

    this.errorMessage = '';

    this.success.set(true);

    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
  }
}
