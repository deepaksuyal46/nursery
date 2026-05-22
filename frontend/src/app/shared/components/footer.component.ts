import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  COMPANY_DESCRIPTION,
  CONTACT_INFO
} from '../contact-info';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="border-t border-white/60 bg-white/70">
      <div class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr,0.75fr,0.9fr] lg:px-8">
        <div>
          <div class="brand-lockup flex items-center gap-4">
            <span class="brand-logo-frame rounded-[1.6rem] bg-[#050505] p-2 shadow-[0_20px_38px_rgba(15,23,42,0.22)]">
              <img
                src="assets/uttarakhand-succulent-logo.png"
                alt="Uttarakhand Succulent"
                width="1024"
                height="1024"
                class="brand-logo-image block h-20 w-20 rounded-[1.2rem] object-cover sm:h-24 sm:w-24"
              />
            </span>
            <div class="brand-wordmark">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Bhimtal Nursery</p>
              <h2 class="mt-2 font-serif text-3xl leading-none text-moss">Uttarakhand Succulent</h2>
            </div>
          </div>
          <p class="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            {{ companyDescription }}
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a
              [href]="contactInfo.instagram"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-moss/10 bg-white px-4 py-2 text-sm font-semibold text-moss transition hover:-translate-y-0.5 hover:border-moss/30"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                <path
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm8.88 1.13a.99.99 0 1 1 0 1.98.99.99 0 0 1 0-1.98ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z"
                />
              </svg>
              Instagram
            </a>
            <a
              [href]="contactInfo.facebook"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-moss/10 bg-white px-4 py-2 text-sm font-semibold text-moss transition hover:-translate-y-0.5 hover:border-moss/30"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
                <path
                  d="M13.5 21v-7.12h2.39l.36-2.78H13.5V9.33c0-.8.22-1.35 1.36-1.35h1.45V5.5a19.28 19.28 0 0 0-2.11-.11c-2.08 0-3.5 1.27-3.5 3.61v2.1H8.35v2.78h2.35V21Z"
                />
              </svg>
              Facebook
            </a>
          </div>
        </div>
        <div class="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <a routerLink="/" class="hover:text-moss">Home</a>
          <a routerLink="/plants" class="hover:text-moss">Plants</a>
          <a routerLink="/contact" class="hover:text-moss">Contact</a>
          <a routerLink="/cart" class="hover:text-moss">Cart</a>
          <a routerLink="/login" class="hover:text-moss">Login</a>
        </div>
        <div class="space-y-3 text-sm text-slate-600">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Contact</p>
          <p><span class="font-semibold text-moss">Address:</span> {{ contactInfo.address }}</p>
          <p>
            <span class="font-semibold text-moss">Phone:</span>
            <a [href]="contactInfo.phoneHref" class="hover:text-moss">{{ contactInfo.phoneDisplay }}</a>
          </p>
          <p>
            <span class="font-semibold text-moss">Email:</span>
            <a [href]="contactInfo.emailHref" class="break-all hover:text-moss">{{ contactInfo.email }}</a>
          </p>
          <p><span class="font-semibold text-moss">Open hours:</span> {{ contactInfo.hours }}</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  readonly companyDescription = COMPANY_DESCRIPTION;
  readonly contactInfo = CONTACT_INFO;
}
