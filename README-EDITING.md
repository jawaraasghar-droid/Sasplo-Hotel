# Editing This Site — Plain-English Guide

This website is plain HTML, CSS, and JavaScript files — no special software or account needed to edit it. Open any `.html` file in a text editor (even Notepad works, though a free editor like VS Code or Notepad++ makes it easier to read) and change the text between the tags. Save the file, refresh the page in your browser, and you'll see the change.

## 1. Adding real photos

Every photo on the site currently shows a placeholder ("Photo coming soon") because no real image files exist yet. To add a photo, just save a `.jpg` file with the **exact name** listed below into the matching folder — no code editing needed, it appears automatically.

**Homepage hero background video/photo:**
- `assets/images/hero/hero-poster.jpg` — the still image shown before the video plays

**Rooms** (`assets/images/rooms/`):
- `standard-room-1.jpg`, `standard-room-2.jpg`
- `deluxe-room-1.jpg`, `deluxe-room-2.jpg`
- `family-suite-1.jpg`, `family-suite-2.jpg`

**Gallery** (`assets/images/gallery/<category>/`), 6 photos per category:
- `hotel/hotel-01.jpg` through `hotel-06.jpg`
- `rooms/rooms-01.jpg` through `rooms-06.jpg`
- `restaurant/restaurant-01.jpg` through `restaurant-06.jpg`
- `views/views-01.jpg` through `views-06.jpg`
- `surroundings/surroundings-01.jpg` through `surroundings-06.jpg`

**Nearby attractions** (`assets/images/attractions/`), one photo each:
- `deosai-national-park.jpg`, `basho-valley.jpg`, `chunda-valley.jpg`, `katpana-sarfaranga-cold-deserts.jpg`, `manthokha-waterfall.jpg`, `kharphocho-fort.jpg`, `manthal-buddha-rock.jpg`, `marsur-rock.jpg`, `shangrila-resort.jpg`, `upper-kachura-lake.jpg`

There's also a drop folder at `assets/images/incoming/` — if you're not sure where a photo belongs yet, just put it there for now.

## 2. Changing the phone number or WhatsApp number

The number appears in two places:
1. `assets/js/site-config.js` — update `phoneDisplay`, `phoneTel`, and `whatsappNumber`.
2. Every one of the 8 `.html` files also has the number written directly in the header and footer (search for `03008108438` or `8108438`). There's no automatic sync between files — search-and-replace across all `.html` files if you change it.

## 3. Adding your real email address

The email is intentionally left as "coming soon" everywhere (footer, Contact page) since one wasn't available yet. Search for `footer.emailSoon` and `Email coming soon` across the `.html` files and `assets/js/i18n/en.js` (and the other 8 language files, if you want it translated too) to replace it once you have a working email address. If you add a real mailto link, make sure it's an inbox someone actually checks.

## 4. Updating room types, prices, and facilities

Edit `assets/js/data/rooms-data.js`. Each room is one entry with a name, capacity, bed type, and a list of facilities. Prices are deliberately shown as "Contact us for current rates" rather than a fixed number — if you'd rather show real prices, add a `rate` field and update `assets/js/rooms.js` to display it.

## 5. Editing nearby attraction descriptions

Edit `assets/js/data/attractions-data.js` for the English name/description. If you want the change reflected in other languages too, also update the matching entry in `assets/js/i18n/<language-code>.js` (e.g. `ur.js` for Urdu) under the `attractions` section — the key names match the English file exactly.

## 6. Editing or adding reviews

Edit `assets/js/data/reviews-data.js`. Each review has a `name`, `rating` (1–5), `quote`, and `context`. The average star rating shown on the site is calculated automatically from these entries — you don't need to update it by hand.

## 7. Changing the hero video

The homepage background video is `assets/video/hero-ducks.mp4`, a short muted clip. To replace it with a different clip, you'll need a video-editing tool to trim/compress a new file to roughly the same length (a few seconds) and small size (under 2–3 MB is ideal for fast loading), then save it over the same filename — or update the `<source src="...">` line near the top of `index.html` to point at a new filename.

## 8. Text in general

Most page text lives directly in the `.html` files as plain, readable sentences — find it and edit it like a Word document. A few pages (Home, Rooms, Gallery, Attractions) build parts of the page automatically from the data files listed above, so check those first if you don't find the text directly in the HTML.

## 9. The 9 languages

The language switcher in the header swaps text using dictionary files in `assets/js/i18n/` — one file per language (`en.js`, `ur.js`, `pa.js`, `ps.js`, `hi.js`, `de.js`, `fr.js`, `zh.js`, `ar.js`). Each file has the exact same structure as `en.js`, just with translated values. To fix or improve a translation, open the relevant file and edit the text next to the matching key.

**Known limitation, worth knowing:** only the English pages are set up to be found by Google search — the other 8 languages are a same-page, in-browser switch for visitors who are already on the site, not separately searchable pages. Making every language separately searchable is a bigger project (essentially 9× the pages) and wasn't part of this build. Also, the 4 guest reviews and the gallery photo captions are intentionally left in English only in every language, since translating individual guest quotes convincingly is a judgment call best made by a person, not automatically.

## 10. Before you go live: update the placeholder domain

Every page currently references a placeholder web address, `https://www.saspolohotel.example` (in the SEO tags, `sitemap.xml`, and `robots.txt`). Once you have a real domain name, search-and-replace this placeholder across all files.

## 11. Putting the site online (hosting)

This site is plain files — it works on **any** web host. Two common paths:
- **Cheap shared hosting (cPanel, etc.):** upload every file and folder via the File Manager or FTP, keeping the same folder structure. Do **not** upload the `tools/` folder — that's only for local editing/testing, not needed for the live site.
- **Free modern hosting (Netlify, Vercel, Cloudflare Pages):** drag-and-drop the whole folder — these also give you free automatic HTTPS (the padlock/security icon) with no extra setup.

Either way, HTTPS/SSL (the padlock icon) is provided by whichever host you choose — it isn't something built into these files, so ask your host if it's automatic (most modern ones are) or need to be turned on.

## 12. Previewing the site on this computer

There's a small local preview server at `tools/serve.ps1` used during development (started via the Claude Code preview tool). It's only for checking your changes before they go live — it doesn't need to run on the actual hosted site.
