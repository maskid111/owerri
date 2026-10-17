/**
 * Local photography registry. Files live in /public/images and are served through next/image.
 * Most photos are from Unsplash (Unsplash License). A handful of Igbo-specific photos come from
 * Wikimedia Commons under CC BY-SA 4.0 — see `wikimediaCredits` and the /credits page.
 * Photos illustrate dishes and moods; they are not photographs of the sample businesses listed.
 */

export const imageNames = [
  "abacha", "assorted-soup", "bar-interior", "bole-street", "booth-plants", "burger", "cafe-bright",
  "cafe-counter", "cafe-interior", "cake", "catfish-pepper-soup", "chicken-jollof", "chicken-pepper-soup",
  "cocktail", "concert", "costume", "courtyard", "dancers", "dining-evening", "dodo", "drum-ensemble",
  "drummers", "drums", "egusi", "fair", "ferris", "festival-women", "festival", "fish-feast",
  "fish-pepper-soup", "fish-plantain", "fried-rice-chicken", "funfair", "gallery-2", "gallery",
  "garden-lights", "garden-night", "glasshouse-dining", "goat-meat", "goat-stew", "green-terrace",
  "greenhouse-cafe", "grilled-chicken", "grilled-platter", "hibiscus", "highlife-band", "hotel-pool",
  "hotel-room", "hotel-suite", "isi-ewu", "jollof-close", "jollof-fish", "jollof-plated", "jollof-skewers",
  "lake-boats", "lake-jetty", "latte", "live-music", "market-pepper", "market", "masquerade-2", "masquerade",
  "nkwobi", "ofe-nsala", "ofe-owerri", "palm-road", "pancakes", "pasta", "pepper-soup-egg", "pepper-soup-pot",
  "performers", "pineapple-juice", "resort-pool", "rice-stew", "rooftop-lights", "rooftop-lounge", "skewers",
  "soups-spread", "suya-grill", "suya-stall", "suya", "swallow-spread", "zobo",
] as const;

export type ImageName = (typeof imageNames)[number];

export const img = (name: ImageName) => `/images/${name}.jpg`;

export const wikimediaCredits: { image: ImageName; title: string; author: string; license: string; url: string }[] = [
  {
    image: "nkwobi",
    title: "Nkwobi 01.jpg",
    author: "Joan Onanyo",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Nkwobi_01.jpg",
  },
  {
    image: "abacha",
    title: "A plate of abacha (african salad) ready for consumption.jpg",
    author: "NiferO",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:A_plate_of_abacha_(african_salad)_ready_for_consumption.jpg",
  },
  {
    image: "isi-ewu",
    title: "Isi ewu.jpg",
    author: "Aderiqueza",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Isi_ewu.jpg",
  },
  {
    image: "masquerade",
    title: "Igbo Cultural Masquerades - 002.jpg",
    author: "Timzy D'Great",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Igbo_Cultural_Masquerades_-_002.jpg",
  },
  {
    image: "masquerade-2",
    title: "Igbo Masquerade.jpg",
    author: "Boss Empire Media",
    license: "CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Igbo_Masquerade.jpg",
  },
];
