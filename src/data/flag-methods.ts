/**
 * The three accepted ways to retire a US flag, rendered as tabs.
 *
 * Note: the old site numbered these "Option One", "Option Two", "Option Four"
 * with no Option Three anywhere. That gap was in their content, not a dropped
 * item — these are renumbered one through three.
 */

export interface FlagMethod {
  id: string;
  name: string;
  short: string;
  preferred?: boolean;
  intro: string;
  steps: string[];
  source?: { label: string; href: string };
}

export const FLAG_METHODS: FlagMethod[] = [
  {
    id: 'burning',
    name: 'Ceremonial burning',
    short: 'Burning',
    preferred: true,
    intro:
      'This is the preferred method of disposal, according to the United States government. The American Legion has produced a detailed procedure for retiring old American flags through burning that they approved at their 19th National Convention in September 1937. There are some essential elements to a retirement ceremony:',
    steps: [
      'Conducting the ceremony at night.',
      'Maintaining a reverent atmosphere.',
      'Ensuring that the flag is properly folded before burning.',
      'Only burning the flag in a large bonfire.',
      'Ensuring all parts of the flag fully burn down to ashes.',
      'Offering prayers of thanks afterward.',
    ],
    source: { label: 'American Legion flag ceremony', href: 'https://www.legion.org/flag/ceremony' },
  },
  {
    id: 'cutting',
    name: 'Cutting the flag',
    short: 'Cutting',
    intro:
      'Because modern flags are made of petroleum-based products, burning them releases toxic gases suh as "formaldehyde, ammonia, carbon monoxide, cyclopentanone, oxides of nitrogen, traces of hydrogen cyanide [and] incompletely burned hydrocarbons". Therefore, people are increasingly looking to methods other than ceremonial burning to respectfully dispose of the American flag. Cutting your flag into pieces is one approved option for disposal. This is acceptable because once it is cut into pieces, it is no longer considered a flag. The procedure for cutting and retiring a flag dictate you must:',
    steps: [
      'Stretch the flag out by its four corners.',
      'Cut the flag in half widthwise, being careful not to cut in any part of the blue area. This blue star field symbolizes the union of all 50 states and therefore should not be cut or otherwise split apart in any way.',
      'Put the two halves together and cut them in half lengthwise.',
      'This will leave you with four sections of flag. Three will be red and white stripes, and one will be the blue star field.',
      'Dispose of the pieces properly.',
    ],
    source: { label: 'US Scouting Service Project', href: 'http://usscouts.org/ceremony/flagret1.asp' },
  },
  {
    id: 'burial',
    name: 'Flag burial',
    short: 'Burial',
    intro:
      'Another retirement alternative is flag burial:',
    steps: [
      'Fold the flag correctly.',
      'Place it in a wooden box.',
      'Bury the box in the ground.',
      'Offer a short funeral or prayer afterward.',
    ],
  },
];

export const FLAG_SOURCES: { label: string; detail: string; href?: string }[] = [
  {
    label: 'Flags USA',
    detail: '"Flag Retirement," April 18, 2023',
    href: 'https://flagsusa.com/flag-retirement/',
  },
  {
    label: 'Scouting America — Capitol Area Council',
    detail: '"Flag Retirement," August 22, 2022',
    href: 'https://www.bsacac.org/resources/flag-retirement/',
  },
  {
    label: 'USHistory.org — Independence Hall Association',
    detail: '"Flag Retirement"',
    href: 'https://www.ushistory.org/betsy/more/flagretirement.htm',
  },
  {
    label: 'U.S. Coast Guard Auxiliary',
    detail: 'Flotilla 8-1, District 7',
    href: 'https://wow.uscgaux.info/content.php?unit=070-08-01&category=us-flag-retirement#:~:text=The%20United%20States%20Code%20Stipulates,to%20be%20no%longer%20serviceable',
  },
  {
    label: 'U.S. Department of War',
    detail: '"How to Properly Dispose of Worn-out U.S. Flags"',
    href: 'https://www.war.gov/News/Feature-Stories/Story/Article/2206946/how-to-properly-dispose-of-worn-out-us-flags/',
  },
  {
    label: 'AmericanFlags.com',
    detail: '"A Patriot\'s Guide to Retiring an American Flag," June 19, 2019',
    href: "https://www.americanflags.com/blog/post/patriots-guide-to-retiring-an-american-flag",
  },
];
