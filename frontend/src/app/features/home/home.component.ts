import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { PlantService } from '../../core/services/plant.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Plant } from '../../core/types/models';
import { PlantCardComponent } from '../../shared/components/plant-card.component';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';
import AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PlantCardComponent, AssetUrlPipe],
  template: `
    <section class="relative overflow-hidden rounded-[2.75rem] border border-white/70 bg-hero-texture px-6 py-8 shadow-soft sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <div class="grid gap-12 lg:grid-cols-[1.02fr,0.98fr] lg:items-center">
        <div data-aos="fade-right" class="max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-[0.34em] text-moss/70">Delivered fresh for every corner</p>
          <h1 class="mt-5 max-w-3xl font-serif text-5xl leading-[0.92] text-moss sm:text-6xl lg:text-7xl">
            Fresh Plants Delivered To Your Doorstep
          </h1>
          <p class="mt-5 max-w-xl text-base leading-8 text-slate-600">
            Bring home healthy indoor, outdoor, and medicinal plants with careful packing, responsive support,
            and a storefront built for quick discovery.
          </p>

          <form class="mt-8" (ngSubmit)="searchPlants()">
            <label class="sr-only" for="home-plant-search">Search plants</label>
            <div class="flex flex-col gap-3 sm:flex-row">
              <div class="relative flex-1">
                <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                    <path
                      d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 1.7a5.8 5.8 0 1 0 0 11.6 5.8 5.8 0 0 0 0-11.6Zm7.7 12.3 2.8 2.8-1.2 1.2-2.8-2.8 1.2-1.2Z"
                    />
                  </svg>
                </span>
                <input
                  id="home-plant-search"
                  [(ngModel)]="searchTerm"
                  name="searchTerm"
                  type="search"
                  class="field home-hero-search h-14 rounded-full !pl-12"
                  placeholder="Search indoor, outdoor, and medicinal plants"
                />
              </div>
              <button type="submit" class="btn-primary h-14 min-w-[9rem] !px-6">Search</button>
            </div>
          </form>

          <div class="mt-6 flex flex-wrap gap-4">
            <a routerLink="/plants" class="btn-primary !px-7">Shop Now</a>
            <button type="button" class="btn-secondary !px-7" (click)="scrollToCategories()">View Categories</button>
          </div>

          <div class="mt-7 flex flex-wrap gap-3">
            <button
              *ngFor="let category of categoryHighlights"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-moss shadow-sm transition hover:-translate-y-0.5 hover:border-moss/20 hover:bg-white"
              (click)="openCategory(category.value)"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-moss/75"></span>
              <span>{{ category.title }}</span>
            </button>
          </div>
        </div>

        <div data-aos="fade-left" class="relative mx-auto w-full max-w-[36rem]">
          <div class="home-hero-showcase">
            <div class="absolute left-6 top-6 z-[2] rounded-full border border-white/80 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-moss shadow-sm">
              {{ heroPlant?.category || 'Featured plant' }}
            </div>
            <img
              [src]="heroPlant?.imageUrl | assetUrl"
              [alt]="heroPlant?.name || 'Featured plant collection'"
              class="home-hero-image"
            />
          </div>

          <div class="mt-5 grid gap-3 sm:hidden">
            <div class="home-hero-card rounded-[1.6rem] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Trusted orders</p>
              <p class="mt-2 text-2xl font-semibold text-moss">500+</p>
              <p class="mt-1 text-sm text-slate-600">Plants Sold</p>
            </div>
            <div class="home-hero-card home-hero-card-delay-1 rounded-[1.6rem] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Fast dispatch</p>
              <p class="mt-2 text-2xl font-semibold text-moss">Free delivery</p>
              <p class="mt-1 text-sm text-slate-600">On selected local orders</p>
            </div>
            <div class="home-hero-card home-hero-card-delay-2 rounded-[1.6rem] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Starter picks</p>
              <p class="mt-2 text-2xl font-semibold text-moss">Indoor plants</p>
              <p class="mt-1 text-sm text-slate-600">from &#8377;199</p>
            </div>
          </div>

          <div data-aos="fade-down-right" data-aos-delay="80" class="absolute -left-3 top-10 z-[3] hidden w-44 sm:block lg:-left-10">
            <div class="home-hero-card rounded-[1.6rem] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Trusted orders</p>
              <p class="mt-2 text-2xl font-semibold text-moss">500+</p>
              <p class="mt-1 text-sm text-slate-600">Plants Sold</p>
            </div>
          </div>

          <div data-aos="fade-up-left" data-aos-delay="180" class="absolute -right-1 top-28 z-[3] hidden w-48 sm:block lg:-right-8">
            <div class="home-hero-card home-hero-card-delay-1 rounded-[1.6rem] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Fast dispatch</p>
              <p class="mt-2 text-2xl font-semibold text-moss">Free delivery</p>
              <p class="mt-1 text-sm text-slate-600">On selected local orders</p>
            </div>
          </div>

          <div data-aos="fade-up-right" data-aos-delay="260" class="absolute left-6 bottom-12 z-[3] hidden w-48 sm:block lg:-left-4">
            <div class="home-hero-card home-hero-card-delay-2 rounded-[1.6rem] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Starter picks</p>
              <p class="mt-2 text-2xl font-semibold text-moss">Indoor plants</p>
              <p class="mt-1 text-sm text-slate-600">from &#8377;49</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="home-categories" class="mt-16 scroll-mt-28">
      <div data-aos="fade-right" class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Browse by category</p>
          <h2 class="font-serif text-5xl text-moss">Pick the plant mood you want.</h2>
        </div>
        <p class="max-w-2xl text-sm leading-7 text-slate-600">
          Start with calm indoor foliage, sun-ready outdoor growers, or traditional medicinal picks and jump straight into the catalog filter you need.
        </p>
      </div>

      <div class="grid gap-5 lg:grid-cols-3">
        <a
          *ngFor="let category of categoryHighlights; let i = index"
          routerLink="/plants"
          [queryParams]="{ category: category.value }"
          data-aos="fade-up"
          [attr.data-aos-delay]="i * 90"
          class="surface-card group flex min-h-[15rem] flex-col justify-between p-6 transition hover:-translate-y-1"
        >
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">{{ category.kicker }}</p>
            <h3 class="mt-4 font-serif text-4xl leading-none text-moss">{{ category.title }}</h3>
            <p class="mt-4 text-sm leading-7 text-slate-600">{{ category.description }}</p>
          </div>
          <span class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-moss group-hover:text-fern">
            Explore {{ category.value }}
            <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
              <path d="m13.2 5.3 6.5 6.5-6.5 6.6-1.2-1.2 4.4-4.5H4.3v-1.7h12.1L12 6.5l1.2-1.2Z" />
            </svg>
          </span>
        </a>
      </div>
    </section>

    <section class="mt-14">
      <div data-aos="fade-right" class="mb-6 flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Featured arrivals</p>
          <h2 class="font-serif text-5xl text-moss">Fresh picks this week</h2>
        </div>
        <a routerLink="/plants" class="text-sm font-semibold text-moss hover:text-fern">Browse full collection</a>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <app-plant-card
          *ngFor="let plant of featuredPlants; let i = index"
          data-aos="fade-up"
          [attr.data-aos-delay]="i * 90"
          [plant]="plant"
          [wishlisted]="wishlistService.has(plant.id)"
          (addToCart)="onAddToCart($event)"
          (toggleWishlist)="onToggleWishlist($event)"
        />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly plantService = inject(PlantService);
  private readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly document = inject(DOCUMENT);

  featuredPlants: Plant[] = [];
  heroPlant: Plant | null = null;
  searchTerm = '';
  readonly categoryHighlights = [
    {
      value: 'Indoor',
      title: 'Indoor Plants',
      kicker: 'Quiet corners',
      description: 'Air-purifying greens for desks, bedrooms, living rooms, and low-fuss daily care.'
    },
    {
      value: 'Outdoor',
      title: 'Outdoor Plants',
      kicker: 'Sunny spaces',
      description: 'Balcony growers, flowering accents, and hardy plants that hold up well outdoors.'
    },
    {
      value: 'Medicinal',
      title: 'Medicinal Plants',
      kicker: 'Home wellness',
      description: 'Traditional household varieties with simple descriptions, clean pricing, and healthy stock.'
    }
  ];

  constructor() {
    this.plantService.getPlants({ limit: 4, sort: 'newest' }).subscribe((page) => {
      this.featuredPlants = page.items;
      this.heroPlant = page.items[0] ?? null;
      this.changeDetectorRef.markForCheck();
      requestAnimationFrame(() => AOS.refreshHard());
    });
  }

  searchPlants() {
    const q = this.searchTerm.trim();
    void this.router.navigate(['/plants'], {
      queryParams: q ? { q } : {}
    });
  }

  openCategory(category: string) {
    void this.router.navigate(['/plants'], {
      queryParams: { category }
    });
  }

  scrollToCategories() {
    this.document.getElementById('home-categories')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  onAddToCart(plantId: number) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Login to add plants to your cart.');
      this.router.navigateByUrl('/login');
      return;
    }

    this.cartService.addItem(plantId).subscribe(() => {
      this.toastService.success('Plant added to cart.');
    });
  }

  onToggleWishlist(plantId: number) {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Login to save plants to your wishlist.');
      this.router.navigateByUrl('/login');
      return;
    }

    const removing = this.wishlistService.has(plantId);
    const request = removing ? this.wishlistService.remove(plantId) : this.wishlistService.add(plantId);

    request.subscribe(() => {
      this.toastService.success(removing ? 'Removed from wishlist.' : 'Added to wishlist.');
    });
  }
}
