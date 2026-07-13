import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme/theme.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  readonly user = this.authService.user;
  readonly isAuthorized = computed(() => this.user() !== null);
  readonly theme = this.themeService.theme;

  signOut(): void {
    this.authService.signOut();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
