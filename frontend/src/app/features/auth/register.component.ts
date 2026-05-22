import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="register-shell mx-auto max-w-6xl overflow-hidden px-1 py-2">
      <div class="register-background" aria-hidden="true">
        <span class="register-glow register-glow-1"></span>
        <span class="register-glow register-glow-2"></span>
        <span class="register-leaf register-leaf-1"></span>
        <span class="register-leaf register-leaf-2"></span>
        <span class="register-leaf register-leaf-3"></span>
        <span class="register-leaf register-leaf-4"></span>
      </div>

      <div class="relative z-10 grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <div data-aos="fade-right" class="register-panel register-info-panel rounded-[2.35rem] p-8 sm:p-10 lg:p-12">
          <div class="flex items-start gap-4">
            <span class="register-hero-mark">
              <svg viewBox="0 0 24 24" class="h-7 w-7 fill-current" aria-hidden="true">
                <path d="M12 3.5c4.4 0 8 3.6 8 8 0 5.7-4.8 8.6-7.5 9.8a1.2 1.2 0 0 1-1 0C8.8 20.1 4 17.2 4 11.5c0-4.4 3.6-8 8-8Zm.8 4.1c-1.9.1-3.6.8-4.8 2.1-1 1.1-1.5 2.4-1.6 4 .8-.9 1.8-1.5 3-1.9 1.3-.5 2.7-.7 4.3-.6-2.2.7-4 1.9-5.3 3.6-.5.7-.9 1.4-1.2 2.3h1.7c.2-.6.5-1.1.9-1.6 1.1-1.5 2.9-2.6 5.1-3.4l.6-.2.1-.6c.3-2 .9-3.9 2-5.4-.8-.2-1.7-.3-2.7-.3h-.1Z" />
              </svg>
            </span>
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.34em] text-clay sm:text-sm">Start growing</p>
              <h1 class="mt-4 max-w-2xl font-serif text-5xl leading-[0.92] text-moss sm:text-6xl">
                Create your nursery account with verified email access.
              </h1>
            </div>
          </div>

          <p class="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            We send a one-time password to your email first. After you verify the code, the account is created and you
            are signed in automatically.
          </p>

          <div class="register-info-badge mt-6 inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-moss">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-white shadow-sm">
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2.8 4.8 5.4v5.3c0 4 2.4 7.5 6.1 9.1l1.1.5 1.1-.5c3.7-1.6 6.1-5.2 6.1-9.1V5.4L12 2.8Zm0 1.7 5.5 2v4.2c0 3.2-1.9 6.2-4.9 7.6l-.6.3-.6-.3c-3-1.4-4.9-4.4-4.9-7.6V6.5L12 4.5Zm-1 8.8-1.8-1.8-1.2 1.2 3 3 5.3-5.3-1.2-1.2-4.1 4.1Z" />
              </svg>
            </span>
            <span>Secure email OTP registration with instant account access after verification.</span>
          </div>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            <div data-aos="zoom-in-up" data-aos-delay="80" class="register-step-card rounded-[1.65rem] p-5 sm:p-6">
              <div class="flex items-start justify-between gap-4">
                <span class="register-step-badge">1</span>
                <span class="register-step-icon">
                  <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9A2.5 2.5 0 0 1 5.5 5Zm0 1.5a1 1 0 0 0-1 1V8l7.5 4.6L19.5 8v-.5a1 1 0 0 0-1-1h-13Zm14 3.3-7.1 4.4a.8.8 0 0 1-.8 0L4.5 9.8v6.7a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.8Z" />
                  </svg>
                </span>
              </div>
              <p class="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step 1</p>
              <p class="mt-3 font-serif text-3xl leading-none text-moss">Send OTP</p>
              <p class="mt-3 text-sm leading-6 text-slate-600">
                Enter your details and we’ll send a 6-digit code to your email.
              </p>
            </div>

            <div data-aos="zoom-in-up" data-aos-delay="160" class="register-step-card rounded-[1.65rem] p-5 sm:p-6">
              <div class="flex items-start justify-between gap-4">
                <span class="register-step-badge">2</span>
                <span class="register-step-icon">
                  <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                    <path d="M12 2.8 4.8 5.4v5.3c0 4 2.4 7.5 6.1 9.1l1.1.5 1.1-.5c3.7-1.6 6.1-5.2 6.1-9.1V5.4L12 2.8Zm0 1.7 5.5 2v4.2c0 3.2-1.9 6.2-4.9 7.6l-.6.3-.6-.3c-3-1.4-4.9-4.4-4.9-7.6V6.5L12 4.5Zm-1 8.8-1.8-1.8-1.2 1.2 3 3 5.3-5.3-1.2-1.2-4.1 4.1Z" />
                  </svg>
                </span>
              </div>
              <p class="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Step 2</p>
              <p class="mt-3 font-serif text-3xl leading-none text-moss">Verify and continue</p>
              <p class="mt-3 text-sm leading-6 text-slate-600">
                Submit the OTP to finish registration and open your account.
              </p>
            </div>
          </div>
        </div>

        <form
          data-aos="fade-left"
          class="register-panel register-form-panel rounded-[2.35rem] p-7 sm:p-8 lg:p-9"
          [formGroup]="form"
          (ngSubmit)="submit()"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.32em] text-clay">Register</p>
              <h2 class="mt-3 font-serif text-4xl leading-none text-moss sm:text-5xl">Open your plant account</h2>
              <p class="mt-3 max-w-md text-sm leading-6 text-slate-500">
                Passwords must include uppercase, lowercase, and a number. Email verification is required before the account is created.
              </p>
            </div>
            <span class="register-form-mark hidden sm:flex">
              <svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12.7 3.5c-3 .1-5.5 1.1-7.1 3.2-1.3 1.7-1.9 3.7-2 6 .7-.8 1.6-1.4 2.6-1.8 1.2-.5 2.5-.7 4-.6-2.2.8-3.9 2-5 3.8-.6.9-1 1.9-1.3 3h1.6c.3-.9.7-1.7 1.2-2.4 1-1.4 2.6-2.5 4.7-3.2l.6-.2.1-.6c.3-2.2 1.1-4.3 2.5-6 .3-.4.6-.6.9-.8l-.3-1.3Z" />
              </svg>
            </span>
          </div>

          <div class="mt-8 space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <div class="register-input-shell">
                <span class="register-input-icon">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 4.2a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4Zm0 1.6a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm0 8.3c3.7 0 6.8 2.1 7.8 5.3l-1.5.5c-.8-2.5-3.2-4.2-6.3-4.2-3 0-5.5 1.7-6.3 4.2l-1.5-.5c1-3.2 4.1-5.3 7.8-5.3Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  class="field register-field disabled:cursor-not-allowed disabled:opacity-70"
                  formControlName="name"
                  placeholder="Your full name"
                />
              </div>
              <p *ngIf="form.controls.name.touched && form.controls.name.invalid" class="mt-2 text-xs text-rose-600">
                Enter your name using at least 2 characters.
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <div class="register-input-shell">
                <span class="register-input-icon">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9A2.5 2.5 0 0 1 5.5 5Zm0 1.5a1 1 0 0 0-1 1V8l7.5 4.6L19.5 8v-.5a1 1 0 0 0-1-1h-13Zm14 3.3-7.1 4.4a.8.8 0 0 1-.8 0L4.5 9.8v6.7a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.8Z" />
                  </svg>
                </span>
                <input
                  type="email"
                  class="field register-field disabled:cursor-not-allowed disabled:opacity-70"
                  formControlName="email"
                  placeholder="you@example.com"
                />
              </div>
              <p *ngIf="form.controls.email.touched && form.controls.email.invalid" class="mt-2 text-xs text-rose-600">
                Enter a valid email address.
              </p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div class="register-input-shell">
                <span class="register-input-icon">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M7.5 10V8.5a4.5 4.5 0 1 1 9 0V10h.8A1.7 1.7 0 0 1 19 11.7v7.1a1.7 1.7 0 0 1-1.7 1.7H6.7A1.7 1.7 0 0 1 5 18.8v-7.1A1.7 1.7 0 0 1 6.7 10h.8Zm1.6 0h5.8V8.5a2.9 2.9 0 1 0-5.8 0V10Zm-2.4 1.6v7.3h10.6v-7.3H6.7Zm5.3 1.5a1.8 1.8 0 0 1 .8 3.4v1.6h-1.6v-1.6a1.8 1.8 0 0 1 .8-3.4Z" />
                  </svg>
                </span>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  class="field register-field pr-24 disabled:cursor-not-allowed disabled:opacity-70"
                  formControlName="password"
                  placeholder="Create a strong password"
                />
                <button type="button" class="register-password-toggle" (click)="togglePasswordVisibility()">
                  {{ showPassword() ? 'Hide' : 'Show' }}
                </button>
              </div>
              <p *ngIf="form.controls.password.touched && form.controls.password.invalid" class="mt-2 text-xs text-rose-600">
                Use at least 8 characters for your password.
              </p>
            </div>

            <div *ngIf="otpRequested()" class="register-status-panel rounded-[1.65rem] p-5">
              <div class="flex items-start gap-3">
                <span class="register-status-icon">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 2.8 4.8 5.4v5.3c0 4 2.4 7.5 6.1 9.1l1.1.5 1.1-.5c3.7-1.6 6.1-5.2 6.1-9.1V5.4L12 2.8Zm0 1.7 5.5 2v4.2c0 3.2-1.9 6.2-4.9 7.6l-.6.3-.6-.3c-3-1.4-4.9-4.4-4.9-7.6V6.5L12 4.5Zm-1 8.8-1.8-1.8-1.2 1.2 3 3 5.3-5.3-1.2-1.2-4.1 4.1Z" />
                  </svg>
                </span>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-moss">Verification code sent</p>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    We sent a 6-digit OTP to
                    <span class="break-all font-semibold text-moss">{{ requestedEmail() ?? form.getRawValue().email }}</span>.
                    It expires in {{ otpExpiresIn() }} minutes.
                  </p>
                </div>
              </div>

              <div *ngIf="devOtp()" class="mt-4 rounded-[1.35rem] border border-sky-200 bg-sky-50/90 px-4 py-4 shadow-[0_18px_34px_rgba(14,165,233,0.1)]">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="max-w-md">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">Local testing mode</p>
                    <p class="mt-2 text-sm leading-6 text-sky-900">
                      Email sending is off right now, so the OTP is shown here for testing. Configure SMTP later to send real emails.
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-full border border-sky-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-900 transition hover:bg-sky-100"
                    (click)="copyDevOtp()"
                  >
                    Copy code
                  </button>
                </div>
                <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-sky-200 bg-white/80 px-4 py-3">
                  <p class="font-mono text-xl font-semibold tracking-[0.32em] text-sky-950 sm:text-2xl">{{ devOtp() }}</p>
                  <button
                    type="button"
                    class="rounded-full bg-sky-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sky-800"
                    (click)="useDevOtp()"
                  >
                    Use this code
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="otpRequested()">
              <label class="mb-2 block text-sm font-medium text-slate-700">Email OTP</label>
              <div class="register-input-shell">
                <span class="register-input-icon">
                  <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 3.1a5 5 0 0 1 5 5V10h.7a1.8 1.8 0 0 1 1.8 1.8v6.4a1.8 1.8 0 0 1-1.8 1.8H6.3a1.8 1.8 0 0 1-1.8-1.8v-6.4A1.8 1.8 0 0 1 6.3 10H7V8.1a5 5 0 0 1 5-5Zm0 1.6a3.4 3.4 0 0 0-3.4 3.4V10h6.8V8.1A3.4 3.4 0 0 0 12 4.7Zm-5.9 7v6.6h11.8v-6.6H6.1Zm5.9 1.4a1.8 1.8 0 0 1 .8 3.4v1.4h-1.6v-1.4a1.8 1.8 0 0 1 .8-3.4Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  inputmode="numeric"
                  maxlength="6"
                  class="field register-field pl-12 text-center font-mono text-lg tracking-[0.3em] sm:tracking-[0.45em]"
                  formControlName="otp"
                  placeholder="123456"
                  (input)="normalizeOtpInput()"
                />
              </div>
              <p *ngIf="form.controls.otp.touched && form.controls.otp.invalid" class="mt-2 text-xs text-rose-600">
                Enter the 6-digit code sent to your email.
              </p>
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary register-submit mt-8 h-14 w-full text-[0.95rem]"
            [disabled]="requestingOtp() || verifyingOtp()"
          >
            <span class="relative z-[1]">{{ submitLabel() }}</span>
          </button>

          <div *ngIf="otpRequested()" class="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              class="btn-secondary register-action-secondary"
              [disabled]="requestingOtp() || verifyingOtp()"
              (click)="resendOtp()"
            >
              Resend code
            </button>
            <button
              type="button"
              class="btn-secondary register-action-secondary"
              [disabled]="requestingOtp() || verifyingOtp()"
              (click)="editDetails()"
            >
              Use different details
            </button>
          </div>

          <p class="mt-6 text-sm text-slate-600">
            Already have an account?
            <a routerLink="/login" class="register-inline-link ml-2 font-semibold text-moss hover:text-fern">
              Login instead
            </a>
          </p>
        </form>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .register-shell {
      position: relative;
      isolation: isolate;
    }

    .register-background {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .register-glow {
      position: absolute;
      border-radius: 9999px;
      filter: blur(58px);
      opacity: 0.5;
      animation: register-glow-pulse 10s ease-in-out infinite;
    }

    .register-glow-1 {
      top: -3rem;
      left: 6%;
      height: 18rem;
      width: 18rem;
      background: rgb(var(--accent-text) / 0.18);
    }

    .register-glow-2 {
      right: 4%;
      bottom: 0.5rem;
      height: 20rem;
      width: 20rem;
      background: rgb(142 182 155 / 0.24);
      animation-delay: -3.2s;
    }

    .register-leaf {
      --leaf-rotate: -24deg;
      position: absolute;
      height: 3.8rem;
      width: 7.2rem;
      border-radius: 100% 0;
      background: linear-gradient(135deg, rgb(var(--accent-text) / 0.18), rgb(142 182 155 / 0.32));
      opacity: 0.55;
      filter: blur(0.2px);
      transform: rotate(var(--leaf-rotate));
      transform-origin: center;
      animation: register-leaf-float 15s ease-in-out infinite;
    }

    .register-leaf::after {
      content: '';
      position: absolute;
      left: 49%;
      top: 12%;
      bottom: 12%;
      width: 1px;
      background: rgb(255 255 255 / 0.6);
      transform: rotate(18deg);
    }

    .register-leaf-1 {
      --leaf-rotate: -28deg;
      left: 2%;
      top: 8%;
    }

    .register-leaf-2 {
      --leaf-rotate: 22deg;
      right: 8%;
      top: 12%;
      height: 4.4rem;
      width: 8rem;
      animation-delay: -5s;
    }

    .register-leaf-3 {
      --leaf-rotate: -8deg;
      left: 10%;
      bottom: 12%;
      height: 3.2rem;
      width: 6.2rem;
      animation-delay: -8s;
    }

    .register-leaf-4 {
      --leaf-rotate: 38deg;
      right: 12%;
      bottom: 10%;
      height: 3.4rem;
      width: 6.6rem;
      animation-delay: -10s;
    }

    .register-panel {
      position: relative;
      overflow: hidden;
      border: 1px solid rgb(var(--surface-border) / 0.62);
      background:
        linear-gradient(180deg, rgb(var(--surface-bg) / 0.9), rgb(var(--surface-bg) / 0.76));
      box-shadow:
        0 28px 70px rgb(var(--surface-shadow) / 0.12),
        inset 0 1px 0 rgb(255 255 255 / 0.42);
      backdrop-filter: blur(22px);
      transition:
        transform 260ms ease,
        box-shadow 260ms ease,
        border-color 260ms ease;
    }

    .register-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top left, rgb(255 255 255 / 0.5), transparent 34%),
        linear-gradient(145deg, rgb(255 255 255 / 0.12), transparent 46%);
      pointer-events: none;
    }

    .register-panel > * {
      position: relative;
      z-index: 1;
    }

    .register-hero-mark,
    .register-form-mark,
    .register-step-icon,
    .register-status-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgb(var(--accent-text));
      background: rgb(var(--accent-text) / 0.12);
      box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.55);
    }

    .register-hero-mark {
      height: 3.6rem;
      width: 3.6rem;
      flex-shrink: 0;
      border-radius: 1.35rem;
    }

    .register-form-mark {
      height: 2.9rem;
      width: 2.9rem;
      flex-shrink: 0;
      border-radius: 9999px;
    }

    .register-info-badge {
      border: 1px solid rgb(var(--surface-border) / 0.75);
      background: rgb(var(--surface-bg) / 0.76);
      box-shadow: 0 18px 40px rgb(var(--surface-shadow) / 0.08);
    }

    .register-step-card {
      position: relative;
      border: 1px solid rgb(var(--surface-border) / 0.74);
      background:
        linear-gradient(180deg, rgb(var(--surface-bg) / 0.72), rgb(var(--surface-bg) / 0.54));
      box-shadow: 0 18px 40px rgb(var(--surface-shadow) / 0.08);
      transition:
        transform 220ms ease,
        box-shadow 220ms ease,
        border-color 220ms ease;
    }

    .register-step-badge {
      display: inline-flex;
      height: 2.15rem;
      width: 2.15rem;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background: rgb(var(--accent-text));
      color: rgb(var(--accent-solid-text));
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow: 0 12px 24px rgb(var(--surface-shadow) / 0.16);
    }

    .register-step-icon,
    .register-status-icon {
      height: 2.5rem;
      width: 2.5rem;
      flex-shrink: 0;
      border-radius: 9999px;
    }

    .register-input-shell {
      position: relative;
      transition: transform 220ms ease;
    }

    .register-input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      z-index: 1;
      display: inline-flex;
      height: 2rem;
      width: 2rem;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      color: rgb(100 116 139);
      background: rgb(var(--surface-bg) / 0.82);
      box-shadow: 0 8px 18px rgb(var(--surface-shadow) / 0.06);
      transform: translateY(-50%);
      transition:
        color 220ms ease,
        background-color 220ms ease,
        transform 220ms ease;
    }

    .register-field {
      padding-left: 3.4rem;
      border-color: rgb(var(--field-border) / 0.9);
      background-color: rgb(var(--field-bg) / 0.92);
      box-shadow: 0 12px 26px rgb(var(--surface-shadow) / 0.05);
      transition:
        transform 220ms ease,
        border-color 220ms ease,
        box-shadow 220ms ease,
        background-color 220ms ease;
    }

    .register-field:focus {
      border-color: rgb(var(--accent-text) / 0.42);
      box-shadow:
        0 0 0 4px rgb(var(--accent-text) / 0.14),
        0 18px 34px rgb(var(--surface-shadow) / 0.1);
    }

    .register-input-shell:focus-within {
      transform: translateY(-1px);
    }

    .register-input-shell:focus-within .register-input-icon {
      color: rgb(var(--accent-text));
      background: rgb(var(--accent-text) / 0.12);
      transform: translateY(-50%) scale(1.03);
    }

    .register-password-toggle {
      position: absolute;
      right: 0.85rem;
      top: 50%;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      border: 1px solid rgb(var(--accent-text) / 0.12);
      background: rgb(var(--surface-bg) / 0.95);
      padding: 0.45rem 0.85rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: rgb(var(--accent-text));
      transform: translateY(-50%);
      transition:
        transform 220ms ease,
        border-color 220ms ease,
        background-color 220ms ease,
        color 220ms ease;
    }

    .register-status-panel {
      border: 1px solid rgb(var(--surface-border) / 0.72);
      background:
        linear-gradient(135deg, rgb(var(--surface-bg) / 0.86), rgb(var(--page-bg) / 0.68));
      box-shadow: 0 18px 38px rgb(var(--surface-shadow) / 0.08);
      animation: register-panel-reveal 340ms ease-out;
    }

    .register-submit {
      position: relative;
      overflow: hidden;
      box-shadow: 0 22px 40px rgb(var(--surface-shadow) / 0.18);
    }

    .register-submit::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 18%, rgb(255 255 255 / 0.28) 50%, transparent 82%);
      transform: translateX(-140%);
      transition: transform 520ms ease;
    }

    .register-action-secondary {
      box-shadow: 0 14px 28px rgb(var(--surface-shadow) / 0.08);
    }

    .register-inline-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .register-inline-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -0.12rem;
      height: 1px;
      width: 100%;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 220ms ease;
    }

    @media (hover: hover) {
      .register-panel:hover {
        transform: translateY(-4px);
        box-shadow:
          0 34px 84px rgb(var(--surface-shadow) / 0.16),
          inset 0 1px 0 rgb(255 255 255 / 0.5);
      }

      .register-step-card:hover {
        transform: translateY(-5px);
        border-color: rgb(var(--accent-text) / 0.18);
        box-shadow: 0 24px 48px rgb(var(--surface-shadow) / 0.12);
      }

      .register-password-toggle:hover {
        transform: translateY(-50%) scale(1.02);
        border-color: rgb(var(--accent-text) / 0.24);
        background: rgb(var(--surface-bg));
      }

      .register-submit:hover {
        transform: translateY(-1px) scale(1.01);
        box-shadow: 0 26px 46px rgb(var(--surface-shadow) / 0.22);
      }

      .register-submit:hover::after {
        transform: translateX(140%);
      }

      .register-inline-link:hover::after {
        transform: scaleX(1);
      }
    }

    @media (max-width: 1023px) {
      .register-glow-1 {
        left: -2rem;
      }

      .register-glow-2 {
        right: -2rem;
      }
    }

    @media (max-width: 639px) {
      .register-leaf {
        opacity: 0.38;
      }

      .register-leaf-1,
      .register-leaf-4 {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .register-glow,
      .register-leaf,
      .register-step-card,
      .register-panel,
      .register-submit,
      .register-submit::after,
      .register-password-toggle,
      .register-inline-link::after {
        animation: none;
        transition: none;
      }
    }

    @keyframes register-glow-pulse {
      0%,
      100% {
        transform: scale(0.96);
        opacity: 0.42;
      }

      50% {
        transform: scale(1.06);
        opacity: 0.58;
      }
    }

    @keyframes register-leaf-float {
      0%,
      100% {
        transform: translateY(0) rotate(var(--leaf-rotate));
      }

      50% {
        transform: translateY(-18px) rotate(calc(var(--leaf-rotate) + 8deg));
      }
    }

    @keyframes register-panel-reveal {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  readonly requestingOtp = signal(false);
  readonly verifyingOtp = signal(false);
  readonly showPassword = signal(false);
  readonly otpRequested = signal(false);
  readonly otpExpiresIn = signal<number | null>(null);
  readonly devOtp = signal<string | null>(null);
  readonly requestedEmail = signal<string | null>(null);
  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    otp: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  submitLabel() {
    if (this.requestingOtp()) {
      return 'Sending verification code...';
    }

    if (this.verifyingOtp()) {
      return 'Verifying code...';
    }

    return this.otpRequested() ? 'Verify OTP and create account' : 'Send verification code';
  }

  submit() {
    if (this.otpRequested()) {
      this.verifyOtp();
      return;
    }

    this.sendOtp();
  }

  resendOtp() {
    this.sendOtp(true);
  }

  editDetails() {
    this.otpRequested.set(false);
    this.otpExpiresIn.set(null);
    this.devOtp.set(null);
    this.requestedEmail.set(null);
    this.form.controls.name.enable();
    this.form.controls.email.enable();
    this.form.controls.password.enable();
    this.form.controls.otp.reset('');
    this.form.controls.otp.disable();
  }

  normalizeOtpInput() {
    const otpControl = this.form.controls.otp;
    const normalizedOtp = otpControl.getRawValue().replace(/\D/g, '').slice(0, 6);

    if (normalizedOtp !== otpControl.getRawValue()) {
      otpControl.setValue(normalizedOtp);
    }
  }

  useDevOtp() {
    const otp = this.devOtp();

    if (!otp) {
      return;
    }

    this.form.controls.otp.setValue(otp);
    this.form.controls.otp.markAsTouched();
  }

  async copyDevOtp() {
    const otp = this.devOtp();

    if (!otp) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      this.toastService.info('Copy is not available here. Use the OTP shown on the page.');
      return;
    }

    try {
      await navigator.clipboard.writeText(otp);
      this.toastService.success('OTP copied to clipboard.');
    } catch {
      this.toastService.info('Copy failed. Use the OTP shown on the page.');
    }
  }

  private sendOtp(isResend = false) {
    if (!this.otpRequested() && !this.registrationDetailsValid()) {
      this.markRegistrationDetailsTouched();
      return;
    }

    this.requestingOtp.set(true);
    this.authService.requestRegisterOtp(this.registrationPayload()).subscribe({
      next: (challenge) => {
        const email = challenge.email;
        this.otpRequested.set(true);
        this.otpExpiresIn.set(challenge.expiresInMinutes);
        this.devOtp.set(challenge.devOtp ?? null);
        this.requestedEmail.set(challenge.email);
        this.form.controls.name.disable();
        this.form.controls.email.setValue(challenge.email);
        this.form.controls.email.disable();
        this.form.controls.password.disable();
        this.form.controls.otp.reset('');
        this.form.controls.otp.enable();
        if (challenge.deliveryMethod === 'development') {
          this.toastService.info('Local testing mode is active. Use the OTP shown below.');
          return;
        }

        this.toastService.success(
          isResend ? `A new verification code was sent to ${email}.` : `Verification code sent to ${email}.`
        );
      },
      error: () => {
        this.requestingOtp.set(false);
      },
      complete: () => {
        this.requestingOtp.set(false);
      }
    });
  }

  private verifyOtp() {
    if (this.form.controls.otp.invalid) {
      this.form.controls.otp.markAsTouched();
      return;
    }

    this.verifyingOtp.set(true);
    this.authService
      .verifyRegisterOtp({
        email: this.requestedEmail() ?? this.form.getRawValue().email.trim(),
        otp: this.form.getRawValue().otp.replace(/\D/g, '').slice(0, 6)
      })
      .subscribe({
        next: () => {
          this.toastService.success('Account created successfully.');
          this.cartService.loadCart().subscribe();
          this.wishlistService.loadWishlist().subscribe();
          this.router.navigateByUrl('/plants');
        },
        error: () => {
          this.verifyingOtp.set(false);
        },
        complete: () => {
          this.verifyingOtp.set(false);
        }
      });
  }

  private registrationDetailsValid() {
    return (
      this.form.controls.name.valid &&
      this.form.controls.email.valid &&
      this.form.controls.password.valid
    );
  }

  private markRegistrationDetailsTouched() {
    this.form.controls.name.markAsTouched();
    this.form.controls.email.markAsTouched();
    this.form.controls.password.markAsTouched();
  }

  private registrationPayload() {
    const { name, email, password } = this.form.getRawValue();
    return { name: name.trim(), email: email.trim(), password };
  }
}
