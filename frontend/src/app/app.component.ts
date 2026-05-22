import { ChangeDetectionStrategy, Component, DestroyRef, AfterViewInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import AOS from 'aos';
import { ShellComponent } from './core/layout/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<app-shell />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private aosReady = false;

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (!this.aosReady) {
          return;
        }

        requestAnimationFrame(() => AOS.refreshHard());
      });
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      AOS.init({
        duration: 900,
        once: true,
        offset: 120,
        easing: 'ease-in-out',
        disable: () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
      this.aosReady = true;
      AOS.refreshHard();
    });
  }
}
