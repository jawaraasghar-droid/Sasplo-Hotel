/* Posts for the "Notes from Saspolo" page — written by the hotel owner
   through the admin panel (Journal tab). The renderer sorts by `date`,
   newest first, so the order here doesn't matter.

   Each post looks like:
     {
       date: "2026-08-04",              // YYYY-MM-DD
       title: "The Deosai road is open",
       body: "First paragraph.\n\nSecond paragraph.",
       images: ["assets/images/journal/journal-1785830653382-0.jpg"]
     }

   Deliberately empty to start — the first post should be the owner's own
   words, not invented ones. The page shows a friendly note until then. */
window.HR_POSTS = [];
