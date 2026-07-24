/* Sample room content — the owner asked to "leave the space" for real room data.
   Names/capacity/facilities are plausible placeholders, safe to show as-is.
   Rates are deliberately NOT invented numbers (see rateNote) since a fabricated
   price could mislead a guest if never updated before launch. */
window.HR_ROOMS = [
  {
    slug: "standard-room",
    name: "Standard Room",
    tierKey: "tierBudget",
    tier: "Budget-Friendly",
    description: "A simple, warm room with everything a tired traveler needs after a day in the valleys.",
    rateNote: "Contact us for current rates",
    images: ["assets/images/gallery/rooms/rooms-02.jpg", "assets/images/gallery/rooms/rooms-05.jpg"]
  },
  {
    slug: "deluxe-room",
    name: "Deluxe Room",
    tierKey: "tierComfort",
    tier: "Comfort",
    description: "More space, a sitting area, and a balcony facing the mountains.",
    rateNote: "Contact us for current rates",
    images: ["assets/images/gallery/rooms/rooms-01.jpg"]
  },
  {
    slug: "family-suite",
    name: "Family Suite",
    tierKey: "tierPremium",
    tier: "Premium",
    description: "Two connected rooms with a shared living space — ideal for families and small groups.",
    rateNote: "Contact us for current rates",
    images: ["assets/images/gallery/rooms/rooms-03.jpg", "assets/images/gallery/rooms/rooms-04.jpg"]
  }
];
