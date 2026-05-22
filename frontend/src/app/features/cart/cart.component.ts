import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { AssetUrlPipe } from '../../shared/pipes/asset-url.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, AssetUrlPipe, EmptyStateComponent],
  template: `
    <section class="checkout-shell relative isolate overflow-hidden px-4 pb-4 pt-2 sm:px-6 lg:px-0">
      <div class="checkout-glow checkout-glow-primary" aria-hidden="true"></div>
      <div class="checkout-glow checkout-glow-secondary" aria-hidden="true"></div>
      <span class="checkout-leaf checkout-leaf-1" aria-hidden="true"></span>
      <span class="checkout-leaf checkout-leaf-2" aria-hidden="true"></span>
      <span class="checkout-leaf checkout-leaf-3" aria-hidden="true"></span>

      <div class="mx-auto max-w-7xl">
        <section class="mb-10 max-w-3xl" data-aos="fade-up" data-aos-duration="700">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-clay">Checkout</p>
          <h1 class="mt-3 font-serif text-5xl leading-none text-moss sm:text-6xl">Delivery details</h1>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Enter your shipping information to complete your plant order.
          </p>
        </section>

        <ng-container *ngIf="cartService.cart()?.items?.length; else emptyCart">
          <form
            id="checkout-form"
            class="grid gap-8 xl:grid-cols-[minmax(0,1.18fr),minmax(320px,0.82fr)] xl:items-start"
            [formGroup]="checkoutForm"
            (ngSubmit)="submitOrder()"
          >
            <section
              class="checkout-panel surface-card p-6 sm:p-8 lg:p-10"
              data-aos="fade-right"
              data-aos-duration="750"
              data-aos-easing="ease-out-cubic"
            >
              <div class="flex flex-wrap items-start justify-between gap-5 border-b border-white/50 pb-6">
                <div class="max-w-2xl">
                  <p class="text-xs font-semibold uppercase tracking-[0.26em] text-clay">Shipping Address</p>
                  <h2 class="mt-3 font-serif text-4xl leading-none text-moss sm:text-5xl">Delivery details</h2>
                  <p class="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    Enter your shipping information to complete your plant order.
                  </p>
                </div>

                <div class="checkout-icon-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7">
                    <path
                      d="M12 4c-4.9 0-7.5 3.5-7.5 7.8 0 4.7 3.4 7.7 7.5 8.2 4.1-.5 7.5-3.5 7.5-8.2C19.5 7.5 16.9 4 12 4Z"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.6"
                    />
                    <path
                      d="M12 4c2.6 2.1 3.8 5 3.8 7.8S14.6 17.7 12 20"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.6"
                    />
                    <path
                      d="M12 4c-2.6 2.1-3.8 5-3.8 7.8S9.4 17.7 12 20"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.6"
                    />
                  </svg>
                </div>
              </div>

              <div class="mt-8 grid gap-5">
                <label class="checkout-field-row" style="--field-delay: 60ms">
                  <span class="checkout-label">
                    <span>Full name</span>
                    <span class="checkout-meta">Required</span>
                  </span>
                  <span class="checkout-input-shell">
                    <span class="checkout-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                        <path
                          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.8"
                        />
                        <path
                          d="M5 20a7 7 0 0 1 14 0"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.8"
                        />
                      </svg>
                    </span>
                    <input
                      class="checkout-field"
                      type="text"
                      formControlName="shippingName"
                      placeholder="Full name"
                      autocomplete="name"
                    />
                  </span>
                  <span class="checkout-error" *ngIf="checkoutForm.controls.shippingName.touched && checkoutForm.controls.shippingName.invalid">
                    Please enter your full name.
                  </span>
                </label>

                <div class="grid gap-5 lg:grid-cols-2">
                  <label class="checkout-field-row" style="--field-delay: 110ms">
                    <span class="checkout-label">
                      <span>Email address</span>
                      <span class="checkout-meta">Required</span>
                    </span>
                    <span class="checkout-input-shell">
                      <span class="checkout-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                          <path
                            d="M4 7.5 10.5 12a2.7 2.7 0 0 0 3 0L20 7.5"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="3"
                            stroke="currentColor"
                            stroke-width="1.7"
                          />
                        </svg>
                      </span>
                      <input
                        class="checkout-field"
                        type="email"
                        formControlName="shippingEmail"
                        placeholder="Email address"
                        autocomplete="email"
                      />
                    </span>
                    <span
                      class="checkout-error"
                      *ngIf="checkoutForm.controls.shippingEmail.touched && checkoutForm.controls.shippingEmail.invalid"
                    >
                      {{
                        checkoutForm.controls.shippingEmail.hasError('required')
                          ? 'Email address is required.'
                          : 'Please enter a valid email address.'
                      }}
                    </span>
                  </label>

                  <label class="checkout-field-row" style="--field-delay: 160ms">
                    <span class="checkout-label">
                      <span>Phone number</span>
                      <span class="checkout-meta">Required</span>
                    </span>
                    <span class="checkout-input-shell">
                      <span class="checkout-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                          <path
                            d="M6.8 3.9h2.6c.4 0 .7.3.8.7l.7 3c.1.4-.1.8-.4 1l-1.6 1.3c1 2.1 2.7 3.8 4.8 4.8l1.3-1.6c.2-.3.7-.5 1-.4l3 .7c.4.1.7.4.7.8v2.6c0 .5-.4 1-.9 1a15 15 0 0 1-14.8-15c0-.5.4-.9.8-.9Z"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                        </svg>
                      </span>
                      <input
                        class="checkout-field"
                        type="tel"
                        formControlName="shippingPhone"
                        placeholder="Phone number"
                        autocomplete="tel"
                      />
                    </span>
                    <span class="checkout-error" *ngIf="checkoutForm.controls.shippingPhone.touched && checkoutForm.controls.shippingPhone.invalid">
                      Phone number is required.
                    </span>
                  </label>
                </div>

                <div class="pt-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.24em] text-clay">Shipping Address</p>
                </div>

                <label class="checkout-field-row" style="--field-delay: 210ms">
                  <span class="checkout-label">
                    <span>Address line 1</span>
                    <span class="checkout-meta">Required</span>
                  </span>
                  <span class="checkout-input-shell">
                    <span class="checkout-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                        <path
                          d="M12 21s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.7"
                        />
                        <circle cx="12" cy="11" r="2.5" stroke="currentColor" stroke-width="1.7" />
                      </svg>
                    </span>
                    <input
                      class="checkout-field"
                      type="text"
                      formControlName="shippingAddressLine1"
                      placeholder="Address line 1"
                      autocomplete="address-line1"
                    />
                  </span>
                  <span
                    class="checkout-error"
                    *ngIf="checkoutForm.controls.shippingAddressLine1.touched && checkoutForm.controls.shippingAddressLine1.invalid"
                  >
                    Address line 1 is required.
                  </span>
                </label>

                <label class="checkout-field-row" style="--field-delay: 260ms">
                  <span class="checkout-label">
                    <span>Address line 2</span>
                    <span class="checkout-meta">Optional</span>
                  </span>
                  <span class="checkout-input-shell">
                    <span class="checkout-input-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                        <path
                          d="M12 21s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.7"
                        />
                        <path
                          d="M9.5 11h5"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.7"
                        />
                      </svg>
                    </span>
                    <input
                      class="checkout-field"
                      type="text"
                      formControlName="shippingAddressLine2"
                      placeholder="Address line 2 (optional)"
                      autocomplete="address-line2"
                    />
                  </span>
                </label>

                <div class="grid gap-5 sm:grid-cols-3">
                  <label class="checkout-field-row" style="--field-delay: 310ms">
                    <span class="checkout-label">
                      <span>City</span>
                      <span class="checkout-meta">Required</span>
                    </span>
                    <span class="checkout-input-shell">
                      <span class="checkout-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                          <path
                            d="M4 20h16"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                          <path
                            d="M7 20v-8l5-3 5 3v8"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                          <path
                            d="M10 13h.01M14 13h.01"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.2"
                          />
                        </svg>
                      </span>
                      <input
                        class="checkout-field"
                        type="text"
                        formControlName="shippingCity"
                        placeholder="City"
                        autocomplete="address-level2"
                      />
                    </span>
                    <span class="checkout-error" *ngIf="checkoutForm.controls.shippingCity.touched && checkoutForm.controls.shippingCity.invalid">
                      City is required.
                    </span>
                  </label>

                  <label class="checkout-field-row" style="--field-delay: 360ms">
                    <span class="checkout-label">
                      <span>State</span>
                      <span class="checkout-meta">Required</span>
                    </span>
                    <span class="checkout-input-shell">
                      <span class="checkout-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                          <path
                            d="M4 18.5 9.5 8l3.2 5 2.5-2.8L20 18.5"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                          <path
                            d="M4 18.5h16"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                        </svg>
                      </span>
                      <input
                        class="checkout-field"
                        type="text"
                        formControlName="shippingState"
                        placeholder="State"
                        autocomplete="address-level1"
                      />
                    </span>
                    <span class="checkout-error" *ngIf="checkoutForm.controls.shippingState.touched && checkoutForm.controls.shippingState.invalid">
                      State is required.
                    </span>
                  </label>

                  <label class="checkout-field-row" style="--field-delay: 410ms">
                    <span class="checkout-label">
                      <span>Postal code</span>
                      <span class="checkout-meta">Required</span>
                    </span>
                    <span class="checkout-input-shell">
                      <span class="checkout-input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5">
                          <rect
                            x="4"
                            y="5"
                            width="16"
                            height="14"
                            rx="3"
                            stroke="currentColor"
                            stroke-width="1.7"
                          />
                          <path
                            d="M8 9h8M8 13h5"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.7"
                          />
                        </svg>
                      </span>
                      <input
                        class="checkout-field"
                        type="text"
                        formControlName="shippingPostalCode"
                        placeholder="Postal code"
                        autocomplete="postal-code"
                      />
                    </span>
                    <span
                      class="checkout-error"
                      *ngIf="checkoutForm.controls.shippingPostalCode.touched && checkoutForm.controls.shippingPostalCode.invalid"
                    >
                      Postal code is required.
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <aside
              class="checkout-panel checkout-summary-panel surface-card p-6 sm:p-8"
              data-aos="fade-left"
              data-aos-duration="750"
              data-aos-easing="ease-out-cubic"
            >
              <div class="flex items-start gap-4">
                <div class="checkout-icon-badge checkout-summary-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" class="h-7 w-7">
                    <path
                      d="M5 7h14l-1.4 7.3a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7L5 7Z"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.7"
                    />
                    <path
                      d="M9 7V5.8A2.8 2.8 0 0 1 11.8 3h.4A2.8 2.8 0 0 1 15 5.8V7"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.7"
                    />
                    <path
                      d="M9.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.7"
                    />
                  </svg>
                </div>

                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.26em] text-clay">Order Summary</p>
                  <h2 class="mt-3 font-serif text-4xl leading-none text-moss">Order Summary</h2>
                  <p class="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <span class="checkout-trust-dot" aria-hidden="true"></span>
                    Secure checkout • Fresh nursery delivery
                  </p>
                </div>
              </div>

              <div class="mt-6 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                <article
                  *ngFor="let item of cartService.cart()?.items"
                  class="checkout-summary-item"
                >
                  <img [src]="item.imageUrl | assetUrl" [alt]="item.name" class="h-20 w-20 rounded-2xl object-cover shadow-sm" />

                  <div class="min-w-0 flex-1">
                    <p class="truncate font-serif text-3xl leading-none text-moss">{{ item.name }}</p>
                    <p class="mt-1 text-sm text-slate-500">{{ item.category }}</p>
                    <p class="mt-2 text-sm text-slate-600">{{ item.price | currency: 'INR':'symbol':'1.0-0' }} each</p>
                    <button type="button" class="checkout-link mt-3" (click)="removeItem(item.id)">Remove</button>
                  </div>

                  <div class="flex flex-col items-end gap-3">
                    <div class="checkout-quantity-control">
                      <button
                        type="button"
                        class="checkout-quantity-button"
                        (click)="changeQuantity(item.id, item.quantity - 1, item.quantity === 1)"
                      >
                        -
                      </button>
                      <span class="min-w-10 text-center text-sm font-semibold text-slate-700">{{ item.quantity }}</span>
                      <button
                        type="button"
                        class="checkout-quantity-button"
                        (click)="changeQuantity(item.id, item.quantity + 1)"
                      >
                        +
                      </button>
                    </div>
                    <p class="text-base font-semibold text-bark">{{ item.subtotal | currency: 'INR':'symbol':'1.0-0' }}</p>
                  </div>
                </article>
              </div>

              <div class="checkout-summary-breakdown mt-6">
                <div class="flex items-center justify-between text-sm text-slate-600">
                  <span>Items</span>
                  <span>{{ cartService.cart()?.itemCount }}</span>
                </div>
                <div class="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div class="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{{ cartService.totalPrice() | currency: 'INR':'symbol':'1.0-0' }}</span>
                </div>
                <div class="mt-5 flex items-center justify-between border-t border-emerald-900/10 pt-5 text-xl font-semibold text-bark">
                  <span>Total</span>
                  <span class="text-2xl">{{ cartService.totalPrice() | currency: 'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>

              <button type="submit" class="btn-primary checkout-submit mt-6 w-full" [disabled]="submitting()">
                <span class="checkout-submit-content">
                  <svg *ngIf="submitting()" viewBox="0 0 24 24" fill="none" class="h-5 w-5 animate-spin">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.28" stroke-width="3"></circle>
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-width="3"
                    ></path>
                  </svg>
                  <span>{{ submitting() ? 'Placing order...' : 'Place order' }}</span>
                </span>
              </button>
            </aside>
          </form>
        </ng-container>
      </div>
    </section>

    <ng-template #emptyCart>
      <app-empty-state
        title="Your cart is empty"
        message="Browse the nursery catalog and add a few plants before checking out."
        actionLabel="Explore plants"
        actionLink="/plants"
      />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly submitting = signal(false);
  readonly checkoutForm = this.formBuilder.nonNullable.group({
    shippingName: [this.authService.user()?.name || '', [Validators.required]],
    shippingEmail: [this.authService.user()?.email || '', [Validators.required, Validators.email]],
    shippingPhone: ['', [Validators.required]],
    shippingAddressLine1: ['', [Validators.required]],
    shippingAddressLine2: [''],
    shippingCity: ['', [Validators.required]],
    shippingState: ['', [Validators.required]],
    shippingPostalCode: ['', [Validators.required]]
  });

  constructor() {
    this.cartService.loadCart().subscribe();
  }

  changeQuantity(itemId: number, quantity: number, removeInstead = false) {
    if (removeInstead || quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.cartService.updateItem(itemId, quantity).subscribe(() => {
      this.toastService.success('Cart updated.');
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      this.toastService.success('Item removed from cart.');
    });
  }

  submitOrder() {
    if (this.checkoutForm.invalid || !this.cartService.cart()?.items.length) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.orderService.checkout(this.checkoutForm.getRawValue()).subscribe({
      next: () => {
        this.toastService.success('Order placed successfully.');
        this.cartService.loadCart().subscribe();
        this.router.navigateByUrl('/orders');
      },
      error: () => {
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}
