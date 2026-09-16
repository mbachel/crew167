/**
 * Flag retirement drop-off locations, Mecklenburg & York County.
 *
 * Carried over from the old site's Summit-project page. To add a location,
 * append an entry — the filter chips on /flag-retirement build themselves from
 * whatever `category` values appear here.
 */

export type LocationCategory =
  | 'Fire Station'
  | 'American Legion'
  | 'VFW'
  | 'Police'
  | 'Scouting'
  | 'Recycling'
  | 'Retail'
  | 'Mail-in';

export interface FlagLocation {
  name: string;
  category: LocationCategory;
  street: string;
  city: string;
  state: 'NC' | 'SC' | 'FL';
  zip?: string;
  /** Set where the source page was ambiguous and someone should confirm it. */
  needsVerification?: string;
}

export const FLAG_LOCATIONS: FlagLocation[] = [
  {
    name: 'Charlotte Fire Department',
    category: 'Fire Station',
    street: '13828 S Tryon St',
    city: 'Charlotte',
    state: 'NC',
    zip: '28278',
  },
  {
    name: 'Charlotte Fire Station',
    category: 'Fire Station',
    street: '12100 Shopton Rd W',
    city: 'Charlotte',
    state: 'NC',
    zip: '28278',
  },
  {
    name: 'Charlotte Fire Station 26',
    category: 'Fire Station',
    street: '9231 S Tryon St',
    city: 'Charlotte',
    state: 'NC',
    zip: '28273',
  },
  {
    name: 'Tega Cay Fire Department',
    category: 'Fire Station',
    street: '1195 Stonecrest Blvd',
    city: 'Tega Cay',
    state: 'SC',
    zip: '29708',
  },
  {
    name: 'Fort Mill Fire and Rescue',
    category: 'Fire Station',
    street: '3005 Pleasant Rd #2927',
    city: 'Fort Mill',
    state: 'SC',
    zip: '29708',
  },

  {
    name: 'American Legion',
    category: 'American Legion',
    street: '4235 W Tyvola Rd',
    city: 'Charlotte',
    state: 'NC',
    zip: '28208',
  },
  {
    name: 'American Legion Post 626',
    category: 'American Legion',
    street: '1940 Donald Ross Rd',
    city: 'Charlotte',
    state: 'NC',
    zip: '28208',
  },
  {
    name: 'American Legion Post 353 — Paw Creek',
    category: 'American Legion',
    street: '5661 Hovis Rd',
    city: 'Charlotte',
    state: 'NC',
    zip: '28216',
  },
  {
    name: 'American Legion Post 208',
    category: 'American Legion',
    street: '801 E South Main St',
    city: 'Waxhaw',
    state: 'NC',
    zip: '28173',
  },
  {
    name: 'American Legion Post 34',
    category: 'American Legion',
    street: '524 Heckle Blvd',
    city: 'Rock Hill',
    state: 'SC',
    zip: '29730',
  },
  {
    name: 'American Legion, Eli Bailes Post 43',
    category: 'American Legion',
    street: '427 Banks St',
    city: 'Fort Mill',
    state: 'SC',
    zip: '29715',
  },

  {
    name: 'Veterans of Foreign Wars',
    category: 'VFW',
    street: '8520 Mt Holly Rd',
    city: 'Charlotte',
    state: 'NC',
    zip: '28214',
  },
  {
    name: 'Veterans of Foreign Wars',
    category: 'VFW',
    street: '1442 Harris Rd',
    city: 'Fort Mill',
    state: 'SC',
    zip: '29715',
  },
  {
    name: 'Veterans of Foreign Wars',
    category: 'VFW',
    street: '1404 Crawford Rd',
    city: 'Rock Hill',
    state: 'SC',
    zip: '29730',
  },
  {
    name: 'Veterans of Foreign Wars',
    category: 'VFW',
    street: '732 W Main St',
    city: 'Rock Hill',
    state: 'SC',
    zip: '29730',
  },

  {
    name: 'Charlotte-Mecklenburg Police Department',
    category: 'Police',
    street: '601 E Trade St',
    city: 'Charlotte',
    state: 'NC',
    zip: '28202',
  },

  {
    name: 'Troop 19 Scout Hut',
    category: 'Scouting',
    street: '201 S Old Statesville Rd',
    city: 'Huntersville',
    state: 'NC',
    zip: '28078',
  },
  {
    name: 'Mecklenburg County Scout Shop',
    category: 'Scouting',
    street: '1410 E 7th St',
    city: 'Charlotte',
    state: 'NC',
    zip: '28204',
  },

  {
    name: 'North Mecklenburg Disposal and Recycling Center',
    category: 'Recycling',
    street: '12300 Statesville Rd',
    city: 'Huntersville',
    state: 'NC',
    zip: '28078',
  },

  {
    name: "Lowe's",
    category: 'Retail',
    street: '1640 SC-160',
    city: 'Fort Mill',
    state: 'SC',
    zip: '29708',
  },

  {
    name: 'Flag Keepers USA — mail your flag',
    category: 'Mail-in',
    street: '8831 Business Park Dr',
    city: 'Fort Myers',
    state: 'FL',
    zip: '33912',
  },
];

export function locationAddress(loc: FlagLocation): string {
  return [loc.street, `${loc.city}, ${loc.state}${loc.zip ? ` ${loc.zip}` : ''}`].join(', ');
}

export function locationMapUrl(loc: FlagLocation): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${loc.name}, ${locationAddress(loc)}`,
  )}`;
}
