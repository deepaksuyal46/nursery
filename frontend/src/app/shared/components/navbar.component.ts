import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ThemeService } from '../../core/services/theme.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 px-3 py-3 sm:px-4">
      <div class="mx-auto max-w-7xl">
        <div class="header-shell">
          <a routerLink="/" class="brand-lockup flex min-w-0 shrink-0 items-center gap-3" (click)="closeMenus()">
            <span class="brand-logo-frame rounded-[1.2rem] bg-[#050505] p-1.5 shadow-[0_16px_32px_rgba(15,23,42,0.22)]">
              <img
                src="assets/uttarakhand-succulent-logo.png"
                alt="Uttarakhand Succulent"
                width="1024"
                height="1024"
                class="brand-logo-image block h-10 w-10 rounded-[0.95rem] object-cover sm:h-11 sm:w-11"
              />
            </span>
            <span class="brand-wordmark min-w-0">
              <span class="block truncate font-serif text-[1.55rem] leading-none text-moss sm:text-[1.7rem]">Uttarakhand</span>
              <span class="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Succulent
              </span>
            </span>
          </a>

          <nav class="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <a
              routerLink="/"
              routerLinkActive="header-nav-link-active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="header-nav-link"
            >
              Home
            </a>
            <a routerLink="/plants" routerLinkActive="header-nav-link-active" class="header-nav-link">Plants</a>
            <a routerLink="/contact" routerLinkActive="header-nav-link-active" class="header-nav-link">Contact</a>
          </nav>

          <div class="hidden items-center gap-2 lg:flex">
            <ng-container *ngIf="authService.isAuthenticated()">
              <a
                routerLink="/wishlist"
                routerLinkActive="header-icon-button-active"
                class="header-icon-button"
                aria-label="Wishlist"
                (click)="closeMenus()"
              >
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 20.9 4.9 14c-1.4-1.3-2.1-2.9-2.1-4.7a5 5 0 0 1 8.7-3.4L12 6.4l.5-.5a5 5 0 0 1 8.7 3.4c0 1.8-.7 3.4-2.1 4.7L12 20.9Z" />
                </svg>
                <span class="header-badge">{{ wishlistService.itemCount() }}</span>
              </a>

              <a
                routerLink="/orders"
                routerLinkActive="header-icon-button-active"
                class="header-icon-button"
                aria-label="Orders"
                (click)="closeMenus()"
              >
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v12.5L15 16H6A1.5 1.5 0 0 1 4.5 14.5V6A1.5 1.5 0 0 1 6 4.5Zm0 1.5v8.5h9.5l2.5 1.9V6H6Zm2 2h8v1.5H8V8Zm0 3h8v1.5H8V11Z" />
                </svg>
              </a>
            </ng-container>

            <a
              routerLink="/cart"
              routerLinkActive="header-icon-button-active"
              class="header-icon-button header-icon-button-strong"
              aria-label="Cart"
              (click)="closeMenus()"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M7.2 6.3 8 9h10.7l-1.4 5.1H9.2L6.8 5.8H3.5V4.3h4.4l.6 2Zm2.1 9.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm7 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
              </svg>
              <span class="header-badge">{{ cartService.itemCount() }}</span>
            </a>

            <button
              type="button"
              class="header-icon-button"
              [attr.aria-label]="themeService.isDark() ? 'Switch to day mode' : 'Switch to night mode'"
              [attr.aria-pressed]="themeService.isDark()"
              (click)="toggleTheme()"
            >
              <ng-container *ngIf="themeService.isDark(); else desktopMoonIcon">
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path
                    d="M12 3.8a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0V4.6a.8.8 0 0 1 .8-.8Zm0 14.5a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0v-1.1a.8.8 0 0 1 .8-.8Zm8.2-6.3a.8.8 0 0 1 0 1.6h-1.1a.8.8 0 0 1 0-1.6h1.1Zm-14.4 0a.8.8 0 0 1 0 1.6H4.7a.8.8 0 0 1 0-1.6h1.1Zm11.03-4.83a.8.8 0 0 1 1.14 1.13l-.79.79a.8.8 0 0 1-1.13-1.14l.78-.78Zm-10.18 10.18a.8.8 0 0 1 1.13 1.14l-.78.78a.8.8 0 1 1-1.14-1.13l.79-.79Zm10.96 1.92a.8.8 0 0 1-1.13 0l-.78-.78a.8.8 0 0 1 1.13-1.14l.78.79a.8.8 0 0 1 0 1.13ZM6.61 6.9a.8.8 0 0 1 0 1.13l-.79.78A.8.8 0 1 1 4.7 7.68l.78-.78a.8.8 0 0 1 1.13 0ZM12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z"
                  />
                </svg>
              </ng-container>
              <ng-template #desktopMoonIcon>
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M20.6 14.2A8.8 8.8 0 0 1 9.8 3.4a9.1 9.1 0 1 0 10.8 10.8Z" />
                </svg>
              </ng-template>
            </button>

            <ng-container *ngIf="authService.isAuthenticated(); else guestLinks">
              <div class="relative">
                <button
                  type="button"
                  class="header-profile-button"
                  aria-haspopup="menu"
                  [attr.aria-expanded]="profileOpen()"
                  (click)="toggleProfile()"
                >
                  <span class="header-avatar" aria-hidden="true">
                    <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current">
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1.8c-4.1 0-7 2.2-7 5.2 0 .6.4 1 1 1h12c.6 0 1-.4 1-1 0-3-2.9-5.2-7-5.2Z" />
                    </svg>
                  </span>
                  <span class="hidden xl:block text-left">
                    <span class="block text-sm font-semibold text-moss">{{ authService.user()?.name }}</span>
                    <span class="block text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">
                      {{ authService.user()?.role }}
                    </span>
                  </span>
                  <svg viewBox="0 0 24 24" class="h-4 w-4 text-slate-400 transition" [class.rotate-180]="profileOpen()" aria-hidden="true">
                    <path d="M6.7 9.7a1 1 0 0 1 1.4 0L12 13.6l3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4Z" fill="currentColor" />
                  </svg>
                </button>

                <div *ngIf="profileOpen()" class="header-dropdown" role="menu">
                  <div class="border-b border-slate-100 px-4 py-4">
                    <p class="text-sm font-semibold text-moss">{{ authService.user()?.name }}</p>
                    <p class="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">{{ authService.user()?.role }}</p>
                  </div>

                  <a routerLink="/orders" class="header-dropdown-link" role="menuitem" (click)="closeMenus()">
                    <span>Orders</span>
                    <span class="text-xs text-slate-400">Track purchases</span>
                  </a>
                  <a routerLink="/wishlist" class="header-dropdown-link" role="menuitem" (click)="closeMenus()">
                    <span>Wishlist</span>
                    <span class="text-xs text-slate-400">{{ wishlistService.itemCount() }} saved</span>
                  </a>
                  <a
                    *ngIf="authService.isAdmin()"
                    routerLink="/admin/dashboard"
                    class="header-dropdown-link"
                    role="menuitem"
                    (click)="closeMenus()"
                  >
                    <span>Admin</span>
                    <span class="text-xs text-slate-400">Dashboard</span>
                  </a>

                  <button type="button" class="header-dropdown-link text-left text-rose-600" role="menuitem" (click)="logout()">
                    <span>Logout</span>
                    <span class="text-xs text-rose-400">End current session</span>
                  </button>
                </div>
              </div>
            </ng-container>
          </div>

          <div class="flex items-center gap-2 lg:hidden">
            <a
              routerLink="/cart"
              routerLinkActive="header-icon-button-active"
              class="header-icon-button header-icon-button-strong"
              aria-label="Cart"
              (click)="closeMenus()"
            >
              <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M7.2 6.3 8 9h10.7l-1.4 5.1H9.2L6.8 5.8H3.5V4.3h4.4l.6 2Zm2.1 9.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Zm7 0a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
              </svg>
              <span class="header-badge">{{ cartService.itemCount() }}</span>
            </a>

            <button
              type="button"
              class="header-icon-button"
              aria-label="Open menu"
              [attr.aria-expanded]="mobileOpen()"
              (click)="toggleMobile()"
            >
              <svg *ngIf="!mobileOpen(); else closeIcon" viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M4 6.8h16v1.8H4V6.8Zm0 4.8h16v1.8H4v-1.8Zm0 4.8h16v1.8H4v-1.8Z" />
              </svg>
              <ng-template #closeIcon>
                <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="m6.7 5.3 5.3 5.3 5.3-5.3 1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4-5.3-5.3-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4Z" />
                </svg>
              </ng-template>
            </button>
          </div>
        </div>

        <div *ngIf="mobileOpen()" class="header-mobile-panel lg:hidden">
          <div class="header-mobile-surface">
            <div *ngIf="authService.isAuthenticated()" class="header-mobile-user">
              <div class="header-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1.8c-4.1 0-7 2.2-7 5.2 0 .6.4 1 1 1h12c.6 0 1-.4 1-1 0-3-2.9-5.2-7-5.2Z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-moss">{{ authService.user()?.name }}</p>
                <p class="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">{{ authService.user()?.role }}</p>
              </div>
            </div>

            <nav class="grid gap-2" aria-label="Mobile">
              <a
                routerLink="/"
                routerLinkActive="header-mobile-link-active"
                [routerLinkActiveOptions]="{ exact: true }"
                class="header-mobile-link"
                (click)="closeMobile()"
              >
                Home
              </a>
              <a routerLink="/plants" routerLinkActive="header-mobile-link-active" class="header-mobile-link" (click)="closeMobile()">
                Plants
              </a>
              <a
                routerLink="/contact"
                routerLinkActive="header-mobile-link-active"
                class="header-mobile-link"
                (click)="closeMobile()"
              >
                Contact
              </a>
              <a routerLink="/cart" routerLinkActive="header-mobile-link-active" class="header-mobile-link" (click)="closeMobile()">
                <span>Cart</span>
                <span class="header-mobile-count">{{ cartService.itemCount() }}</span>
              </a>
              <a
                *ngIf="authService.isAuthenticated()"
                routerLink="/wishlist"
                routerLinkActive="header-mobile-link-active"
                class="header-mobile-link"
                (click)="closeMobile()"
              >
                <span>Wishlist</span>
                <span class="header-mobile-count">{{ wishlistService.itemCount() }}</span>
              </a>
              <a
                *ngIf="authService.isAuthenticated()"
                routerLink="/orders"
                routerLinkActive="header-mobile-link-active"
                class="header-mobile-link"
                (click)="closeMobile()"
              >
                Orders
              </a>
              <a
                *ngIf="authService.isAdmin()"
                routerLink="/admin/dashboard"
                routerLinkActive="header-mobile-link-active"
                class="header-mobile-link"
                (click)="closeMobile()"
              >
                Admin
              </a>
            </nav>

            <button
              type="button"
              class="theme-toggle mt-4 w-full justify-between"
              [attr.aria-label]="themeService.isDark() ? 'Switch to day mode' : 'Switch to night mode'"
              [attr.aria-pressed]="themeService.isDark()"
              (click)="toggleTheme()"
            >
              <span class="flex items-center gap-3">
                <span class="theme-toggle-badge">
                  <ng-container *ngIf="themeService.isDark(); else mobileMoonIcon">
                    <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                      <path
                        d="M12 3.8a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0V4.6a.8.8 0 0 1 .8-.8Zm0 14.5a.8.8 0 0 1 .8.8v1.1a.8.8 0 1 1-1.6 0v-1.1a.8.8 0 0 1 .8-.8Zm8.2-6.3a.8.8 0 0 1 0 1.6h-1.1a.8.8 0 0 1 0-1.6h1.1Zm-14.4 0a.8.8 0 0 1 0 1.6H4.7a.8.8 0 0 1 0-1.6h1.1Zm11.03-4.83a.8.8 0 0 1 1.14 1.13l-.79.79a.8.8 0 0 1-1.13-1.14l.78-.78Zm-10.18 10.18a.8.8 0 0 1 1.13 1.14l-.78.78a.8.8 0 1 1-1.14-1.13l.79-.79Zm10.96 1.92a.8.8 0 0 1-1.13 0l-.78-.78a.8.8 0 0 1 1.13-1.14l.78.79a.8.8 0 0 1 0 1.13ZM6.61 6.9a.8.8 0 0 1 0 1.13l-.79.78A.8.8 0 1 1 4.7 7.68l.78-.78a.8.8 0 0 1 1.13 0ZM12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Z"
                      />
                    </svg>
                  </ng-container>
                  <ng-template #mobileMoonIcon>
                    <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M20.6 14.2A8.8 8.8 0 0 1 9.8 3.4a9.1 9.1 0 1 0 10.8 10.8Z" />
                    </svg>
                  </ng-template>
                </span>
                <span>{{ themeService.isDark() ? 'Switch to day mode' : 'Switch to night mode' }}</span>
              </span>
              <span class="text-xs uppercase tracking-[0.18em] text-slate-500">
                {{ themeService.isDark() ? 'Night' : 'Day' }}
              </span>
            </button>

            <div *ngIf="!authService.isAuthenticated()" class="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                routerLink="/login"
                routerLinkActive="!border-moss/15 !bg-white !text-moss shadow-[0_18px_36px_rgba(33,75,55,0.12)]"
                [routerLinkActiveOptions]="{ exact: true }"
                (click)="closeMobile()"
                class="btn-secondary !w-full !justify-center !px-4 !py-3"
              >
                Login
              </a>
              <a
                routerLink="/register"
                routerLinkActive="scale-[1.01] shadow-[0_20px_38px_rgba(33,75,55,0.2)]"
                (click)="closeMobile()"
                class="btn-primary !w-full !justify-center !px-4 !py-3"
              >
                Register
              </a>
            </div>

            <button *ngIf="authService.isAuthenticated()" type="button" class="header-mobile-logout mt-4" (click)="logout()">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <ng-template #guestLinks>
      <div class="ml-1 flex items-center gap-2">
        <a
          routerLink="/login"
          routerLinkActive="!border-moss/15 !bg-white !text-moss shadow-[0_18px_36px_rgba(33,75,55,0.12)]"
          [routerLinkActiveOptions]="{ exact: true }"
          class="btn-secondary !px-4 !py-2.5 !text-[0.82rem]"
        >
          Login
        </a>
        <a
          routerLink="/register"
          routerLinkActive="scale-[1.01] shadow-[0_20px_38px_rgba(33,75,55,0.2)]"
          class="btn-primary !px-4 !py-2.5 !text-[0.82rem]"
        >
          Register
        </a>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly themeService = inject(ThemeService);
  readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly mobileOpen = signal(false);
  readonly profileOpen = signal(false);

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeMenus();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeMenus();
  }

  logout() {
    this.closeMenus();
    this.authService.logout();
    this.cartService.clear();
    this.wishlistService.clear();
    this.router.navigateByUrl('/');
  }

  toggleMobile() {
    this.profileOpen.set(false);
    this.mobileOpen.update((open) => !open);
  }

  toggleProfile() {
    this.mobileOpen.set(false);
    this.profileOpen.update((open) => !open);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  closeMobile() {
    this.mobileOpen.set(false);
    this.profileOpen.set(false);
  }

  closeMenus() {
    this.mobileOpen.set(false);
    this.profileOpen.set(false);
  }
}
