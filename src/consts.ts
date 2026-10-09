export const SITE_NAME = 'My Pet Experts';
export const SITE_DESCRIPTION =
  'Vet-sourced guides and carefully researched product picks for dog and cat owners.';
// TODO: set up this inbox (or swap in your own address) before launch.
export const CONTACT_EMAIL = 'hello@mypetexperts.com';

// TODO: add your first name (it's shown as a signature on the home page) and a photo at public/owner.jpg.
export const OWNER_NAME = '';
export const OWNER_PHOTO = '';

export const PETS = {
  dogs: { label: 'Dogs', blurb: 'Food safety, walking gear, beds, and the chewing phase.' },
  cats: { label: 'Cats', blurb: 'Toxic plants, litter, fountains, and things worth scratching.' },
} as const;

export type Pet = keyof typeof PETS;

// Amazon Associates tracking ID (looks like "mypetexperts-20"). Once set, every Amazon link on the site
// becomes an affiliate link. Approved under the same account as paddleboardnation.com.
export const AMAZON_TAG = 'mypetexperts-20';
