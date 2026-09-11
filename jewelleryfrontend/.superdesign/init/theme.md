Existing: emerald #063b2e, ivory #f7f4ee, gold #c9a66b; Cormorant Garamond and IBM Plex Sans. 4px spacing scale; breakpoints 768/1024/1280.
## src/app/globals.css
```
@import "tailwindcss";
@import "./tokens.css";
@import "./home.css";
@import "./shop.css";
* {
  box-sizing: border-box;
  letter-spacing: 0;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 110px;
}
body {
  margin: 0;
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  line-height: 1.65;
}
h1,
h2,
h3,
p {
  margin: 0;
}
h1,
h2 {
  font-family: var(--font-display), serif;
  font-weight: 600;
  line-height: 1.1;
}
h2 {
  font-size: 36px;
}
h3 {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
}
em {
  font-weight: 500;
}
a {
  color: inherit;
  text-decoration: none;
}
button,
input,
select,
textarea {
  font: inherit;
}
button,
a,
input,
select {
  touch-action: manipulation;
}
button {
  cursor: pointer;
  color: inherit;
  background: none;
  border: 0;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
input,
select,
textarea {
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 10px 12px;
  max-width: 100%;
}
input:focus,
select:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
a:focus-visible,
button:focus-visible,
summary:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 4px;
}
img {
  max-width: 100%;
  object-fit: cover;
}
svg {
  flex-shrink: 0;
  stroke-width: 1.5;
}
button,
a {
  transition:
    color var(--transition),
    background var(--transition),
    border-color var(--transition);
}
.container {
  width: min(var(--content-width), calc(100% - 96px));
  margin-inline: auto;
}
.section {
  padding-block: 72px;
}
.eyebrow {
  display: block;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
}
.button {
  display: inline-flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  min-height: 44px;
  padding: 12px 24px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-button);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 12px;
  font-weight: 500;
}
.button:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
.button.secondary {
  background: transparent;
  color: var(--color-primary);
}
.button.secondary:hover {
  background: var(--color-primary-tint);
}
.button.light {
  background: var(--color-footer-text);
  border-color: var(--color-footer-text);
  color: var(--color-footer);
}
.button.full {
  width: 100%;
}
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  position: relative;
  flex-shrink: 0;
  border-radius: 50%;
}
.icon-button svg {
  width: 20px;
  height: 20px;
}
.icon-button:hover {
  background: var(--color-primary-tint);
  color: var(--color-primary);
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  min-height: 44px;
  font-size: 12px;
  border-bottom: 1px solid var(--color-text);
  width: fit-content;
}
.text-link:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
.skip-link {
  position: fixed;
  left: 16px;
  top: -100px;
  z-index: 100;
  background: var(--color-surface);
  padding: 12px;
}
.skip-link:focus {
  top: 12px;
}
.announcement {
  min-height: 32px;
  padding: 6px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-brand-fixed);
  color: var(--color-white);
  font-size: 9px;
}
.ribbon-assurance {
  display: flex;
  align-items: center;
  gap: 8px;
}
.site-header {
  position: sticky;
  top: 0;
  background: var(--color-surface-soft);
  z-index: 30;
  border-bottom: 1px solid var(--color-border);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 88px;
  padding: 12px 40px;
}
.wordmark {
  font-family: var(--font-display), serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.05;
  white-space: nowrap;
}
.wordmark span {
  font-family: var(--font-body), sans-serif;
  font-size: 8px;
  font-weight: 400;
  display: block;
  text-align: center;
  margin-top: 7px;
}
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 22px;
  font-size: 12px;
}
.desktop-nav > a,
.desktop-nav > button {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.desktop-nav a:hover,
.desktop-nav button:hover {
  color: var(--color-primary);
}
.header-actions {
  display: flex;
}
.count {
  position: absolute;
  right: 0;
  top: 1px;
  min-width: 16px;
  height: 16px;
  font-size: 9px;
  line-height: 16px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: 50%;
}
.mobile-menu {
  display: none;
}
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.4fr;
  gap: 48px;
  padding: 32px max(48px, calc((100vw - 1200px) / 2));
  background: var(--color-surface);
  border-block: 1px solid var(--color-border);
}
.mega-menu h3 {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
}
.mega-menu a {
  display: block;
  min-height: 36px;
  font-size: 13px;
}
.mega-menu a:hover {
  color: var(--color-primary);
}
.menu-feature img {
  width: 100%;
  height: 140px;
}
.menu-feature span {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}
.section-heading .eyebrow {
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}
.section-heading h2 {
  font-size: 34px;
}
.section-heading p {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 12px;
}
.carousel {
  position: relative;
  min-width: 0;
}
.carousel-scroll {
  overflow: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}
.carousel-scroll::-webkit-scrollbar {
  display: none;
}
.carousel-controls {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 12px;
}
.carousel-controls .icon-button {
  border: 1px solid var(--color-border);
}
.newsletter {
  padding: 48px 0;
  background: var(--color-brand-fixed);
  color: var(--color-ivory-fixed);
}
.newsletter-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;
  align-items: center;
}
.newsletter h2 {
  font-size: 30px;
  margin: 12px 0;
}
.newsletter p {
  font-size: 11px;
  opacity: 0.8;
}
.newsletter-input {
  display: flex;
  border-bottom: 1px solid var(--color-white-rule);
}
.newsletter input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--color-white);
  padding-left: 0;
  border-radius: 0;
}
.newsletter input::placeholder {
  color: var(--color-white-muted);
}
.newsletter button {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 11px;
  white-space: nowrap;
  padding: 0 8px;
}
.newsletter small {
  font-size: 9px;
  opacity: 0.65;
  display: block;
  margin-top: 12px;
}
.footer {
  padding: 64px 0 0;
  background: var(--color-footer);
  color: var(--color-footer-text);
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr) 1.1fr;
  gap: 36px;
  padding-bottom: 48px;
}
.footer .wordmark {
  font-size: 30px;
  display: inline-block;
  color: var(--color-footer-text);
}
.footer-grid p {
  font-size: 11px;
  color: var(--color-footer-muted);
  margin: 24px 0;
}
.footer-grid h3 {
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 20px;
}
.footer-grid > div > a:not(.wordmark) {
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  min-height: 30px;
  font-size: 11px;
  color: var(--color-footer-muted);
}
.social-links {
  display: flex;
  gap: 12px;
}
.social-links a {
  display: grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  border-top: 1px solid var(--color-white-border);
  padding-block: 24px;
  font-size: 9px;
  color: var(--color-footer-muted);
}
.footer-bottom > div {
  display: flex;
  gap: 20px;
}
.payments span {
  color: var(--color-footer-text);
  font-weight: 600;
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}

```

## src/app/home.css
```
.hero {
  height: min(620px, calc(100svh - 190px));
  min-height: 480px;
  position: relative;
  overflow: hidden;
  background: var(--color-image);
  color: var(--color-charcoal);
}
.hero > img {
  object-position: center 42%;
}
.hero-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-bottom: 30px;
}
.hero .eyebrow {
  margin-bottom: 24px;
  color: var(--color-brand-fixed);
}
.hero h1 {
  font-size: 56px;
  line-height: 1.06;
  max-width: 610px;
}
.hero h1 em {
  color: var(--color-brand-fixed);
}
.hero p {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-editorial-text);
  margin: 24px 0 28px;
}
.hero .button {
  background: var(--color-brand-fixed);
  color: var(--color-white);
  border-color: var(--color-brand-fixed);
}
.hero-secondary {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 11px;
  margin-top: 12px;
  min-height: 44px;
}
.hero-caption,
.hero-edition {
  position: absolute;
  bottom: 25px;
  z-index: 1;
  font-size: 9px;
}
.hero-caption {
  left: 48px;
}
.hero-edition {
  right: 48px;
}
.trust-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 24px 8%;
  background: var(--color-surface-soft);
  border-bottom: 1px solid var(--color-border);
}
.trust-bar > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 11px;
  border-right: 1px solid var(--color-border);
}
.trust-bar > div:last-child {
  border: 0;
}
.trust-bar svg {
  color: var(--color-primary);
}
.categories-section .section-heading {
  text-align: center;
  justify-content: center;
}
.category-track {
  display: flex;
  gap: 32px;
  min-width: max-content;
  padding: 4px;
}
.category {
  width: 128px;
  text-align: center;
  scroll-snap-align: start;
}
.category > div {
  width: 128px;
  height: 128px;
  overflow: hidden;
  border-radius: 50%;
  background: var(--color-image);
  border: 1px solid var(--color-border);
}
.category img {
  width: 100%;
  height: 100%;
  transition: transform var(--transition);
}
.category h3 {
  font-size: 12px;
  margin-top: 16px;
}
.category:hover {
  color: var(--color-primary);
}
.category:hover img {
  transform: scale(1.02);
}
.categories-section {
  padding-bottom: 36px;
}
.arrivals {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 32px;
  padding-top: 40px;
}
.arrival-intro {
  padding: 36px 0;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.arrival-intro .eyebrow {
  color: var(--color-primary);
  margin-bottom: 20px;
}
.arrival-intro h2 {
  font-size: 38px;
}
.arrival-intro p {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 20px 0;
}
.editorial-number {
  margin-top: auto;
  padding-top: 28px;
  font-size: 9px;
  color: var(--color-text-muted);
}
.arrival-products {
  display: grid;
  grid-template-columns: repeat(4, minmax(190px, 1fr));
  gap: 20px;
  padding: 3px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}
.product-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  transition:
    transform var(--transition),
    border-color var(--transition);
}
.product-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}
.product-image {
  aspect-ratio: 4/5;
  position: relative;
  background: var(--color-image);
  overflow: hidden;
}
.product-image > a {
  display: block;
  width: 100%;
  height: 100%;
}
.product-image img {
  transition: transform var(--transition);
  object-fit: cover;
}
.product-card:hover .product-image img {
  transform: scale(1.02);
}
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 8px;
  font-size: 9px;
  background: var(--color-primary-tint);
  color: var(--color-primary);
  border-radius: 2px;
}
.badge.bestseller {
  background: var(--color-charcoal);
  color: var(--color-white);
}
.badge.premium {
  background: var(--color-gold-light);
  color: var(--color-gold-text);
}
.product-image .heart {
  position: absolute;
  right: 6px;
  top: 5px;
  background: var(--color-image-control);
  color: var(--color-charcoal);
}
.heart.selected {
  color: var(--color-brand-fixed);
}
.quick-view {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: var(--color-image-overlay);
  color: var(--color-charcoal);
  font-size: 11px;
  opacity: 0;
  transition: opacity var(--transition);
}
.product-card:hover .quick-view,
.product-card:focus-within .quick-view {
  opacity: 1;
}
.product-info {
  padding: 16px;
  position: relative;
}
.product-category {
  font-size: 9px;
  color: var(--color-text-secondary);
  margin-bottom: 5px;
}
.product-info h3 {
  font-size: 13px;
  min-height: 39px;
  line-height: 1.5;
}
.rating {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 10px;
  margin: 3px 0 10px;
}
.rating span {
  color: var(--color-text-muted);
}
.price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 14px;
}
.price s {
  font-size: 11px;
  color: var(--color-text-muted);
}
.price > span {
  font-size: 10px;
  color: var(--color-primary);
}
.quick-add {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 44px;
  margin-top: 4px;
  font-size: 11px;
}
.craft-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  background: var(--color-brand-fixed);
  color: var(--color-ivory-fixed);
}
.craft-photo {
  position: relative;
  min-height: 500px;
  overflow: hidden;
}
.craft-photo img {
  object-position: 90% 35%;
  width: 160% !important;
  max-width: none;
  left: -60% !important;
}
.craft-copy {
  padding: 64px 72px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.craft-copy .eyebrow {
  font-size: 9px;
  opacity: 0.8;
  margin-bottom: 24px;
}
.craft-copy h2 {
  font-size: 52px;
}
.craft-copy p {
  font-size: 13px;
  max-width: 360px;
  opacity: 0.8;
  margin: 24px 0 28px;
}
.craft-values {
  display: flex;
  gap: 40px;
  width: 100%;
  border-top: 1px solid var(--color-white-divider);
  margin-top: 40px;
  padding-top: 24px;
  font-size: 10px;
}
.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.style-image {
  position: relative;
  aspect-ratio: 5/3;
  overflow: hidden;
  background: var(--color-image);
}
.style-image img {
  transition: transform var(--transition);
}
.style-card:hover img {
  transform: scale(1.02);
}
.style-card > div:last-child {
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}
.style-card h3 {
  font-size: 16px;
}
.style-card p {
  font-size: 11px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
.style-card svg {
  position: absolute;
  right: 0;
  top: 24px;
}
.silver-section {
  background: var(--color-surface-secondary);
  padding: 48px 0;
}
.silver-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.silver-photo {
  position: relative;
  aspect-ratio: 5/4;
}
.silver-copy {
  padding: 32px 0;
}
.silver-copy h2 {
  font-size: 52px;
  margin-top: 20px;
}
.silver-copy > p {
  font-size: 13px;
  color: var(--color-text-secondary);
  max-width: 340px;
  margin: 24px 0;
}
.silver-note {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 40px;
  font-size: 12px;
}
.silver-note small {
  color: var(--color-text-secondary);
  font-size: 10px;
}
.looks-section {
  background: var(--color-surface-soft);
}
.looks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.look {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}
.look img {
  transition: transform var(--transition);
}
.look:hover img {
  transform: scale(1.02);
}
.look-0 img {
  object-position: 85% center;
}
.look span {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  background: var(--color-look-caption);
  padding: 16px;
  color: var(--color-charcoal);
  font-size: 12px;
}
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.reviews-section .section-heading {
  justify-content: center;
  text-align: center;
}
.review-card {
  border: 1px solid var(--color-border);
  padding: 28px;
  border-radius: 4px;
  background: var(--color-surface);
}
.review-stars {
  display: flex;
  gap: 3px;
}
.review-card blockquote {
  font-size: 13px;
  line-height: 1.8;
  margin: 20px 0 28px;
  min-height: 94px;
}
.review-person {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 10px;
}
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: var(--color-surface-secondary);
  border-radius: 50%;
  font-family: var(--font-display);
  font-size: 18px;
}
.review-person small {
  display: block;
  color: var(--color-text-secondary);
}
.verified {
  margin-left: auto;
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 8px;
  color: var(--color-text-secondary);
}

```

## src/app/responsive.css
```
@media (min-width: 1600px) {
  .hero-content {
    width: calc(100% - 160px);
  }
  .hero > img {
    object-position: center 38%;
  }
}
@media (max-width: 1279px) {
  .header-inner {
    padding-inline: 24px;
    gap: 16px;
  }
  .desktop-nav {
    gap: 14px;
    font-size: 11px;
  }
  .header-actions .icon-button {
    width: 36px;
  }
  .wordmark {
    font-size: 26px;
  }
  .container {
    width: calc(100% - 64px);
  }
  .craft-copy {
    padding: 48px;
  }
  .review-card {
    padding: 20px;
  }
  .verified {
    display: none;
  }
}
@media (max-width: 1023px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu {
    display: flex;
  }
  .header-inner {
    min-height: 76px;
  }
  .header-actions .icon-button {
    width: 44px;
  }
  .header-inner .wordmark {
    margin-right: auto;
  }
  .hero {
    min-height: 460px;
    height: 560px;
  }
  .hero h1 {
    font-size: 42px;
  }
  .hero-content {
    padding-bottom: 0;
  }
  .hero p {
    max-width: 300px;
    font-size: 14px;
  }
  .hero > img {
    object-position: 58% center;
  }
  .hero-caption {
    left: 32px;
  }
  .hero-edition {
    right: 32px;
  }
  .arrivals {
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 24px;
  }
  .arrival-intro h2 {
    font-size: 32px;
  }
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .craft-copy {
    padding: 32px;
  }
  .craft-copy h2,
  .silver-copy h2 {
    font-size: 42px;
  }
  .craft-values {
    gap: 24px;
  }
  .silver-inner {
    gap: 40px;
  }
  .newsletter-inner {
    gap: 32px;
  }
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .footer-brand {
    grid-column: 1/-1;
  }
  .collection-layout {
    gap: 24px;
    grid-template-columns: 170px minmax(0, 1fr);
  }
  .collection-layout .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .product-detail {
    gap: 32px;
  }
  .detail-copy h1 {
    font-size: 32px;
  }
}
@media (max-width: 767px) {
  .container {
    width: calc(100% - 32px);
  }
  .section {
    padding-block: 40px;
  }
  .announcement {
    padding: 8px 12px;
    justify-content: center;
    font-size: 8px;
    text-align: center;
  }
  .ribbon-assurance {
    display: none;
  }
  .header-inner {
    min-height: 68px;
    padding: 8px 12px;
    gap: 8px;
  }
  .header-inner .wordmark {
    font-size: 25px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
  }
  .wordmark span {
    font-size: 7px;
  }
  .header-actions {
    margin-left: auto;
  }
  .desktop-action {
    display: none;
  }
  .header-actions .icon-button {
    width: 40px;
  }
  .hero {
    height: 610px;
    min-height: 0;
  }
  .hero > img {
    height: 65% !important;
    top: auto !important;
    bottom: 0 !important;
    object-position: 75% 35%;
  }
  .hero-content {
    justify-content: flex-start;
    padding-top: 32px;
    width: calc(100% - 32px);
    pointer-events: none;
  }
  .hero-content a {
    pointer-events: auto;
  }
  .hero h1 {
    font-size: 34px;
    max-width: 340px;
  }
  .hero .eyebrow {
    font-size: 9px;
    margin-bottom: 12px;
  }
  .hero p {
    font-size: 12px;
    max-width: 240px;
    margin: 16px 0;
  }
  .hero .button {
    font-size: 10px;
    min-height: 44px;
    padding: 10px 18px;
    gap: 12px;
  }
  .hero-secondary {
    font-size: 10px;
    margin-top: 4px;
  }
  .hero-caption {
    bottom: 14px;
    left: 16px;
    font-size: 7px;
    background: var(--color-hero-caption);
    padding: 4px 8px;
  }
  .hero-edition {
    display: none;
  }
  .trust-bar {
    padding: 16px;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 8px;
  }
  .trust-bar > div {
    font-size: 9px;
    gap: 8px;
    justify-content: flex-start;
    border: 0;
  }
  .trust-bar svg {
    width: 18px;
  }
  .section-heading {
    margin-bottom: 24px;
    gap: 16px;
  }
  .section-heading h2 {
    font-size: 28px;
  }
  .section-heading p {
    font-size: 11px;
  }
  .section-heading .eyebrow {
    font-size: 8px;
  }
  .section-heading .text-link {
    font-size: 10px;
    gap: 6px;
    white-space: nowrap;
  }
  .categories-section {
    padding-bottom: 12px;
  }
  .category-track {
    gap: 20px;
  }
  .category,
  .category > div {
    width: 92px;
  }
  .category > div {
    height: 92px;
  }
  .category h3 {
    font-size: 10px;
    margin-top: 12px;
  }
  .arrivals {
    display: block;
    padding-top: 24px;
  }
  .arrival-intro {
    padding: 0 0 24px;
  }
  .arrival-intro h2 {
    font-size: 32px;
  }
  .arrival-intro .eyebrow {
    margin-bottom: 12px;
  }
  .arrival-intro p {
    margin: 12px 0;
  }
  .editorial-number {
    display: none;
  }
  .arrival-products {
    grid-template-columns: repeat(4, 165px);
    gap: 16px;
  }
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .product-info {
    padding: 12px;
  }
  .product-info h3 {
    font-size: 12px;
    min-height: 36px;
  }
  .product-category {
    font-size: 8px;
  }
  .price {
    gap: 5px;
    font-size: 13px;
  }
  .price s {
    font-size: 10px;
  }
  .price > span {
    font-size: 9px;
  }
  .badge {
    top: 8px;
    left: 8px;
    font-size: 8px;
    padding: 2px 5px;
  }
  .product-image .heart {
    right: 0;
    top: 0;
  }
  .heart svg {
    width: 17px;
  }
  .quick-view {
    opacity: 1;
    min-height: 44px;
    font-size: 9px;
  }
  .quick-add {
    font-size: 10px;
  }
  .craft-section {
    grid-template-columns: 1fr;
  }
  .craft-photo {
    min-height: 300px;
    height: 300px;
  }
  .craft-photo img {
    width: 100% !important;
    left: 0 !important;
    object-position: center 32%;
  }
  .craft-copy {
    padding: 40px 24px;
  }
  .craft-copy h2 {
    font-size: 40px;
  }
  .craft-copy .eyebrow {
    font-size: 8px;
    margin-bottom: 16px;
  }
  .craft-copy p {
    font-size: 12px;
    margin: 20px 0 24px;
  }
  .craft-values {
    margin-top: 28px;
    justify-content: space-between;
    gap: 12px;
  }
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px 16px;
  }
  .style-image {
    aspect-ratio: 1/1;
  }
  .style-card h3 {
    font-size: 13px;
    padding-right: 18px;
  }
  .style-card p {
    font-size: 10px;
    min-height: 32px;
  }
  .style-card svg {
    width: 15px;
    top: 18px;
  }
  .silver-section {
    padding: 0;
  }
  .silver-inner {
    grid-template-columns: 1fr;
    gap: 0;
    width: 100%;
  }
  .silver-photo {
    aspect-ratio: 5/4;
  }
  .silver-copy {
    padding: 32px 24px 40px;
  }
  .silver-copy h2 {
    font-size: 40px;
    margin-top: 12px;
  }
  .silver-note {
    margin-top: 24px;
  }
  .looks-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .look span {
    font-size: 10px;
    padding: 12px;
  }
  .review-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .review-card blockquote {
    min-height: 0;
    margin: 16px 0 24px;
  }
  .verified {
    display: flex;
  }
  .newsletter {
    padding: 40px 0;
  }
  .newsletter-inner {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .newsletter h2 {
    font-size: 28px;
  }
  .newsletter .eyebrow {
    font-size: 8px;
  }
  .footer {
    padding-top: 40px;
  }
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 24px;
  }
  .footer-grid > div:last-child {
    grid-column: 1/-1;
  }
  .footer-grid > div > a:not(.wordmark) {
    min-height: 36px;
  }
  .footer-bottom {
    flex-wrap: wrap;
    gap: 20px;
    font-size: 9px;
  }
  .footer-bottom > span {
    width: 100%;
  }
  .footer-bottom .payments {
    flex-wrap: wrap;
    gap: 12px;
  }
  .modal-inner {
    padding: 20px;
  }
  .modal.wide {
    height: 100svh;
    max-height: 100svh;
    border-radius: 0;
  }
  .modal-heading h2 {
    font-size: 25px;
  }
  .quick-product {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .quick-image {
    aspect-ratio: 1/1;
  }
  .search-result {
    gap: 10px;
  }
  .search-result span {
    font-size: 12px;
  }
  .search-result strong {
    font-size: 11px;
  }
  .page-shell {
    padding-block: 24px 40px;
  }
  .page-heading h1,
  .prose h1 {
    font-size: 34px;
  }
  .collection-layout {
    display: block;
  }
  .desktop-filters {
    display: none;
  }
  .mobile-filter-button {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    min-height: 44px;
  }
  .collection-toolbar {
    flex-wrap: wrap;
    padding: 8px 0;
    gap: 8px;
  }
  .collection-toolbar select {
    max-width: 190px;
  }
  .product-detail {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .detail-copy h1 {
    font-size: 34px;
  }
  .detail-actions {
    gap: 8px;
  }
  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .form-grid {
    gap: 16px;
  }
  .form-grid label {
    grid-column: 1/-1;
  }
  .account-tabs {
    gap: 16px;
  }
  .account-tabs button {
    font-size: 11px;
  }
}

```

## src/app/shop.css
```
.modal {
  position: fixed;
  inset: 0 0 0 auto;
  margin: 0;
  max-height: 100svh;
  height: 100svh;
  width: 480px;
  max-width: 100%;
  border: 0;
  border-left: 1px solid var(--color-border);
  padding: 0;
  background: var(--color-surface);
  color: var(--color-text);
}
.modal::backdrop {
  background: var(--color-backdrop);
}
.modal.wide {
  inset: 0;
  margin: auto;
  width: 880px;
  height: fit-content;
  max-height: 90svh;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.modal-inner {
  padding: 28px;
}
.modal-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
  margin-bottom: 24px;
}
.modal-heading h2 {
  font-size: 28px;
}
.search-panel form {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 28px;
}
.search-panel input {
  border: 0;
  flex: 1;
  min-width: 0;
}
.search-result {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-light);
}
.search-result span {
  flex: 1;
}
.search-result small {
  display: block;
  font-size: 11px;
  color: var(--color-text-secondary);
}
.search-result strong {
  font-size: 12px;
}
.search-panel .eyebrow {
  margin-top: 24px;
  color: var(--color-text-secondary);
}
.search-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}
.search-categories a {
  padding: 10px 16px;
  background: var(--color-primary-tint);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 12px;
}
.mobile-nav > a,
.mobile-nav > button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 48px;
  border-bottom: 1px solid var(--color-border);
}
.quick-product {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
.quick-image {
  position: relative;
  aspect-ratio: 4/5;
}
.quick-product h2 {
  font-size: 32px;
  margin: 12px 0 20px;
}
.quick-product p {
  color: var(--color-text-secondary);
  font-size: 13px;
  margin: 24px 0;
}
.quick-product .text-link {
  display: flex;
  margin-top: 12px;
}
.empty-state {
  text-align: center;
  padding: 64px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.empty-state p {
  color: var(--color-text-secondary);
}
.shipping-progress {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  background: var(--color-primary-tint);
  padding: 16px;
  color: var(--color-primary);
}
.shipping-progress progress {
  width: 100%;
  height: 4px;
  accent-color: var(--color-primary);
  margin-top: 8px;
}
.bag-item {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}
.bag-item img {
  width: 90px;
  height: 112px;
}
.bag-item p {
  font-size: 10px;
  color: var(--color-text-secondary);
  margin: 4px 0 8px;
}
.bag-item strong {
  font-size: 13px;
}
.quantity-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}
.quantity {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  height: 44px;
}
.quantity button {
  width: 40px;
  height: 42px;
  display: grid;
  place-items: center;
}
.quantity span {
  width: 28px;
  text-align: center;
  font-size: 12px;
}
.coupon {
  display: flex;
  gap: 8px;
  margin: 24px 0 12px;
}
.coupon input {
  min-width: 0;
  width: 100%;
}
.summary {
  margin: 24px 0;
}
.summary > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  margin: 12px 0;
}
.summary dd {
  margin: 0;
}
.summary .total {
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
  font-size: 17px;
  font-weight: 600;
}
.fine-print {
  font-size: 10px;
  text-align: center;
  color: var(--color-text-secondary);
  margin-top: 12px;
}
.form-error {
  color: var(--color-error);
  font-size: 12px;
}
.success {
  color: var(--color-success);
  font-size: 12px;
}
.page-shell {
  padding-block: 40px 80px;
  min-height: 60vh;
}
.breadcrumb {
  font-size: 11px;
  color: var(--color-text-secondary);
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
}
.page-heading {
  margin-bottom: 36px;
}
.page-heading h1 {
  font-size: 44px;
}
.page-heading p {
  margin-top: 12px;
  color: var(--color-text-secondary);
}
.collection-toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border-block: 1px solid var(--color-border);
  padding: 16px 0;
  margin-bottom: 32px;
  font-size: 12px;
}
.collection-toolbar select {
  font-size: 12px;
}
.collection-layout {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 36px;
}
.collection-layout .product-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.filters fieldset {
  border: 0;
  border-bottom: 1px solid var(--color-border);
  padding: 0 0 20px;
  margin: 0 0 20px;
}
.filters legend {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 12px;
}
.filters label {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 36px;
  font-size: 12px;
}
.filters input[type="checkbox"] {
  min-height: auto;
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}
.filters input[type="range"] {
  width: 100%;
  padding: 0;
  accent-color: var(--color-primary);
}
.filters > button {
  font-size: 12px;
  text-decoration: underline;
  min-height: 44px;
}
.mobile-filter-button {
  display: none;
}
.product-detail {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
}
.detail-photo {
  position: relative;
  aspect-ratio: 1/1;
  background: var(--color-image);
  overflow: hidden;
}
.detail-photo img.zoomed {
  transform: scale(1.65);
}
.detail-photo button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: var(--color-surface);
}
.gallery-thumbs {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.gallery-thumbs button {
  border: 1px solid var(--color-border);
  padding: 4px;
  font-size: 10px;
}
.gallery-thumbs button.active {
  border-color: var(--color-primary);
}
.gallery-thumbs img {
  display: block;
}
.detail-copy h1 {
  font-size: 40px;
  margin: 16px 0;
}
.detail-copy .price {
  font-size: 23px;
  margin-top: 16px;
}
.detail-copy > p {
  color: var(--color-text-secondary);
  margin: 20px 0;
}
.detail-copy .tax-note {
  font-size: 11px;
  margin: 8px 0 20px;
}
.detail-actions {
  display: flex;
  gap: 12px;
  margin: 24px 0 12px;
}
.detail-actions .button {
  flex: 1;
}
.delivery-check {
  margin: 28px 0;
}
.delivery-check form {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.delivery-check input {
  min-width: 0;
  flex: 1;
}
.detail-tabs {
  margin-top: 28px;
  display: flex;
  border-bottom: 1px solid var(--color-border);
  gap: 24px;
}
.detail-tabs button {
  min-height: 44px;
  font-size: 12px;
}
.detail-tabs button.active {
  border-bottom: 2px solid var(--color-text);
}
.details-list details {
  border-bottom: 1px solid var(--color-border);
  padding: 12px 0;
}
.details-list summary {
  cursor: pointer;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}
.details-list p {
  padding: 12px 0;
  color: var(--color-text-secondary);
  font-size: 12px;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-grid label {
  font-size: 12px;
}
.form-grid input {
  display: block;
  width: 100%;
  margin-top: 6px;
}
.form-grid .span-2 {
  grid-column: 1/-1;
}
.notice {
  padding: 16px;
  background: var(--color-primary-tint);
  color: var(--color-primary);
  font-size: 12px;
  margin-bottom: 24px;
}
.account-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 32px;
}
.account-tabs button {
  min-height: 44px;
  font-size: 13px;
}
.account-tabs .active {
  border-bottom: 2px solid var(--color-text);
}
.prose {
  max-width: 760px;
}
.prose h1 {
  font-size: 44px;
  margin-bottom: 24px;
}
.prose h2 {
  font-size: 28px;
  margin: 32px 0 16px;
}
.prose p {
  margin: 16px 0;
  color: var(--color-text-secondary);
}
.skeleton {
  min-height: 300px;
  background: var(--color-surface-secondary);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}
.loading-heading {
  width: 40%;
  height: 48px;
  margin-bottom: 32px;
  min-height: 0;
}
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

```

## src/app/tokens.css
```
:root {
  --color-brand-fixed: #063b2e;
  --color-white: #fff;
  --color-charcoal: #191919;
  --color-ivory-fixed: #f5f2ea;
  --color-editorial-text: #514c46;
  --color-gold-text: #644921;
  --color-white-border: #ffffff20;
  --color-white-divider: #ffffff30;
  --color-white-rule: #ffffff80;
  --color-white-muted: #ffffffa6;
  --color-image-control: #ffffffd9;
  --color-image-overlay: #ffffffea;
  --color-look-caption: #ffffffec;
  --color-hero-caption: #f7f4eecc;
  --color-backdrop: #0006;
  --color-primary: #063b2e;
  --color-primary-hover: #04291f;
  --color-primary-tint: #e8f0ec;
  --color-gold: #c9a66b;
  --color-gold-light: #f3e8d0;
  --color-background: #f7f4ee;
  --color-surface: #fff;
  --color-surface-soft: #fbf9f5;
  --color-surface-secondary: #f0ece4;
  --color-text: #191919;
  --color-text-secondary: #66615a;
  --color-text-muted: #8a857d;
  --color-border: #ddd8cf;
  --color-border-light: #eae6de;
  --color-success: #247a55;
  --color-success-tint: #e8f4ed;
  --color-warning: #a86d00;
  --color-warning-tint: #fff4d9;
  --color-error: #b42318;
  --color-error-tint: #fdecea;
  --color-on-primary: #fff;
  --color-footer: #191919;
  --color-footer-text: #f5f2ea;
  --color-footer-muted: #aaa69f;
  --color-image: #f4f0e8;
  --radius-button: 20px;
  --radius-card: 4px;
  --radius-input: 4px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 80px;
  --content-width: 1280px;
  --transition: 180ms ease;
  color-scheme: light;
}
[data-theme="dark"] {
  --color-background: #111412;
  --color-surface-soft: #171b18;
  --color-surface: #1d231f;
  --color-surface-secondary: #232a26;
  --color-text: #f5f2ea;
  --color-text-secondary: #b8b5ae;
  --color-text-muted: #8e918c;
  --color-border: #343b36;
  --color-border-light: #343b36;
  --color-primary: #5faf91;
  --color-primary-hover: #7bc2a6;
  --color-primary-tint: #19372d;
  --color-gold: #d8b878;
  --color-success: #62b78a;
  --color-on-primary: #111412;
  color-scheme: dark;
}

```