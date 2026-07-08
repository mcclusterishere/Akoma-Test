# Akoma — Books & Coffee · the rebuild

A modern, fast, one-page rebuild of visitakoma.com: bookstore + coffeehouse + nonprofit +
podcast + press under one roof, with a **native book search** that sells inventory the
store doesn't hold — without the visitor ever leaving the site.

## Go live (5 minutes)

1. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / root → Save.
2. The site is at `https://<owner>.github.io/akoma-test/` in ~2 minutes.
3. Custom domain: Pages → Custom domain → `visitakoma.com` (then point the domain's
   A/CNAME records at GitHub Pages — replaces the HostGator hosting bill entirely).

## Pull the real brand assets

Actions tab → **Fetch assets from visitakoma.com** → Run workflow. GitHub's runners scrape
every image the old site serves into `assets/scraped/` and commit them. Pick the keepers,
swap them into `index.html` (hero background, room photos, the real logo if there is one).

## How the bookstore works (selling books you don't have)

The search bar hits the **Open Library API** from the visitor's browser — free, no key,
no backend, millions of titles with covers. Every result gets an **"Order through Akoma"**
button: v1 sends a structured order email (title/author/ISBN pre-filled) to the shop.
You fulfill from a distributor and the customer picks up with a coffee. The sale never
leaves the house.

### The fulfillment stack — who actually gets you the book

| Channel | What it is | Cost | Use it for |
|---|---|---|---|
| **Ingram (ipage.ingramcontent.com)** | THE wholesale account every indie bookstore runs on. 40%+ trade discounts, 1–3 day shipping, ~7.5M titles. Apply with the store's EIN + resale certificate. | Free account; you pay wholesale per book | 90% of special orders — this is the backbone |
| **Bookshop.org (affiliate)** | Online storefront that fulfills for you; store earns ~30% of cover on your sales, no inventory ever | Free | Zero-touch online sales while Ingram spins up |
| **Libro.fm** | Same model for audiobooks — store gets a storefront + split | Free | Audiobook money you're leaving on the table today |
| **AbeBooks / Alibris / Biblio.com** | The rare & used marketplaces. Source rare books on demand; Biblio is indie-owned and does dealer accounts | Commission per sale / dealer rates | The "Rare & vintage" filter — quote the customer, source, margin up |
| **ISBNdb / Open Library** | Book metadata (what the search bar already uses) | Free–$15/mo | Already wired in |

**vs. IndieCommerce ($50/mo + ABA membership):** IndieCommerce is a full cart with Ingram
integration baked in — worth it *later* if order volume gets real. This build gives him the
search + special-order flow at $0/mo, so the $300 stays margin while volume grows. The
upgrade path: keep this site as the brand front, bolt IndieCommerce (or Shopify + Ingram
app) underneath the Order button when orders pass ~30/month.

### Rare books, concretely
1. Customer searches → flips the **Rare & vintage** chip (pre-1975 first printings surface).
2. Order button emails the shop with ISBN + year.
3. Shop quotes from AbeBooks/Biblio dealer pricing + margin (rare regularly carries 30–50%).
4. Customer confirms, pays at the counter or by payment link, book ships to the store.

## The client math (from the notes)

- **$400 onboarding**: this rebuild, domain cutover, assets pulled, search + order flow
  live, Google Business profile refreshed.
- **$300/mo**: hosting is now $0 (GitHub Pages), so the retainer is pure service — a
  monthly content drop (podcast clips, book-of-the-week posts), menu/site edits, order-flow
  upkeep, and the marketing calendar. That's the pitch: *same spend, hosting bill deleted,
  and the money buys marketing instead of servers.*

## Files

- `index.html` — the whole site (hero, catalog, coffee menu, the four rooms, visit)
- `js/books.js` — Open Library search + rare filter + order sheet (`ORDER_EMAIL` at top)
- `css/akoma.css` — warm paper/espresso/gold system, Fraunces + Inter
- `assets/akoma-mark.svg` — the Akoma (Adinkra heart) mark
- `.github/workflows/fetch-assets.yml` — pulls the old site's images on demand
