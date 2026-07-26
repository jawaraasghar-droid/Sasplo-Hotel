# Editing This Site — Plain-English Guide

> **Easier way:** once the admin panel is set up (see `SETUP-ADMIN.md`), photos, rooms, reviews, and contact info can all be edited from `admin.html` in your browser — no file editing or re-uploading. The sections below remain the manual fallback, and cover a few things the panel doesn't (translations, page text).

This website is plain HTML, CSS, and JavaScript files — no special software or account needed to edit it. Open any `.html` file in a text editor (even Notepad works, though a free editor like VS Code or Notepad++ makes it easier to read) and change the text between the tags. Save the file, refresh the page in your browser, and you'll see the change.

## 1. Photos

All photos live under `assets/images/`. To replace one, save your new `.jpg` over the existing filename — no code editing needed. To add an extra photo to a gallery category, drop the file in the right folder using the next number in the sequence (e.g. `views-07.jpg`) and add a matching line in `assets/js/data/gallery-data.js`.

- **Homepage hero photo:** `assets/images/hero/hero-main.jpg`
- **Logo:** `assets/images/logo.png` (header, all pages) and `assets/images/favicon.png` (browser-tab icon)
- **Gallery** (`assets/images/gallery/<category>/`):
  - `rooms/rooms-01.jpg` … `rooms-06.jpg` — these same photos are also used on the Rooms page (see `assets/js/data/rooms-data.js` for which photo belongs to which room type)
  - `food/` — named per dish (`biryani.jpg`, `mamtu.jpg`, `mutton-karahi.jpg`, …)
  - `restaurant/restaurant-01.jpg` … `restaurant-06.jpg` — each has a visible restaurant-name caption, set in `gallery-data.js` (`caption` field). Only this category shows captions.
  - `views/views-01.jpg` … `views-06.jpg`
  - `surroundings/surroundings-01.jpg` … `surroundings-04.jpg` (the last two Surroundings entries reuse photos from the `views/` folder — see `gallery-data.js`)
- **Page background photos** (About / Booking / Facilities / Contact): `assets/images/backgrounds/<pagename>.jpg`
- **Nearby attractions** (`assets/images/attractions/`): one photo per place, named after the place (e.g. `deosai-national-park.jpg`)
- **Social-share preview image** (shown when the site link is shared on WhatsApp/Facebook): `assets/images/og/og-default.jpg`

**Keep photos small.** Anything much over ~500 KB slows the site down. If a photo comes straight off a phone it's probably 2–4 MB — resize it to about 1920 pixels wide before uploading.

## 2. Changing the phone / WhatsApp number

The current number is **+92 355 5014433**, and it appears in two places:
1. `assets/js/site-config.js` — update the phone/WhatsApp values there.
2. Every one of the 8 `.html` files also has the number written directly (as `+92 355 5014433` in visible text and `923555014433` inside `tel:` and `wa.me` links, plus `+92-355-5014433` in the SEO data on `index.html` and `contact.html`). There's no automatic sync — search-and-replace across all `.html` files.

## 3. Changing the email address

The current address is **Karimi.mazahir@gmail.com**. Email links open Gmail's compose window (they use `https://mail.google.com/mail/?view=cm&fs=1&to=...` instead of `mailto:` so they work even on computers with no email program installed). To change the address, search-and-replace `Karimi.mazahir@gmail.com` across all 8 `.html` files — it appears in the footer of every page, on the Contact page, and in the SEO data on `index.html` and `contact.html`.

## 4. Changing the Facebook page link

Search-and-replace `https://www.facebook.com/HotelSaspoloSkardu` across the `.html` files — it's the round Facebook icon in every footer, a card on the Contact page, and part of the SEO data.

## 5. Updating room types, prices, and facilities

Edit `assets/js/data/rooms-data.js`. Each room is one entry with a name, description, and photo list (photos come from `assets/images/gallery/rooms/`). Prices are deliberately shown as "Contact us for current rates" rather than a fixed number — if you'd rather show real prices, add a `rate` field and update `assets/js/rooms.js` to display it.

## 6. Editing nearby attraction descriptions

Edit `assets/js/data/attractions-data.js` for the English name/description. If you want the change reflected in other languages too, also update the matching entry in `assets/js/i18n/<language-code>.js` (e.g. `ur.js` for Urdu) under the `attractions` section — the key names match the English file exactly.

## 7. Editing or adding reviews

Edit `assets/js/data/reviews-data.js`. Each review has a `name`, `rating` (1–5), `quote`, and `context`. The average star rating shown on the site is calculated automatically from these entries — you don't need to update it by hand.

## 8. Text in general

Most page text lives directly in the `.html` files as plain, readable sentences — find it and edit it like a Word document. A few pages (Home, Rooms, Gallery, Attractions) build parts of the page automatically from the data files listed above, so check those first if you don't find the text directly in the HTML.

## 9. The 9 languages

The language switcher in the header swaps text using dictionary files in `assets/js/i18n/` — one file per language (`en.js`, `ur.js`, `pa.js`, `ps.js`, `hi.js`, `de.js`, `fr.js`, `zh.js`, `ar.js`). Each file has the exact same structure as `en.js`, just with translated values. To fix or improve a translation, open the relevant file and edit the text next to the matching key.

**Known limitation, worth knowing:** only the English pages are set up to be found by Google search — the other 8 languages are a same-page, in-browser switch for visitors who are already on the site, not separately searchable pages. Making every language separately searchable is a bigger project (essentially 9× the pages) and wasn't part of this build. Also, the 4 guest reviews and the gallery photo captions (restaurant names) are intentionally in English only in every language.

## 10. Before you go live: update the placeholder domain

Every page currently references a placeholder web address, `https://www.saspolohotel.example` (in the SEO tags, `sitemap.xml`, and `robots.txt`). Once you have a real domain name, search-and-replace this placeholder across all files. Until this is done and the site is uploaded to a real host, Google cannot find or index the site.

## 11. Putting the site online (hosting)

This site is plain files — it works on **any** web host. Two common paths:
- **Cheap shared hosting (cPanel, etc.):** upload every file and folder via the File Manager or FTP, keeping the same folder structure. Do **not** upload the `tools/` folder — that's only for local editing/testing, not needed for the live site.
- **Free modern hosting (Netlify, Vercel, Cloudflare Pages):** drag-and-drop the whole folder — these also give you free automatic HTTPS (the padlock/security icon) with no extra setup.

Either way, HTTPS/SSL (the padlock icon) is provided by whichever host you choose — it isn't something built into these files, so ask your host if it's automatic (most modern ones are) or needs to be turned on.

## 12. Previewing the site on this computer

There's a small local preview server at `tools/serve.ps1` used during development (started via the Claude Code preview tool). It's only for checking your changes before they go live — it doesn't need to run on the actual hosted site.
