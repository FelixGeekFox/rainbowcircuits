/**
 * Support & wellbeing resources for the /resources/ page.
 *
 * IMPORTANT, before relying on anything here:
 *  - Verify every link and any contact detail. Organizations, phone
 *    numbers, and coverage areas change over time.
 *  - This page is peer/community information, NOT professional help.
 *  - The community is international, so most listed services are US/UK or
 *    global directories. Please add services for your members' own regions
 *    where you see the [placeholder] entries.
 *
 * To edit: change the text below, add/remove entries, or add a whole new
 * group. `placeholder: true` renders an obvious "to be added" card and has
 * no link — replace it with a real, verified resource.
 */

export interface ResourceLink {
  name: string;
  description: string;
  /** Omit for placeholder entries. Link to the org's own site, not a raw number. */
  url?: string;
  region?: string;
  placeholder?: boolean;
}

export interface ResourceGroup {
  title: string;
  emoji: string;
  blurb?: string;
  resources: ResourceLink[];
}

export const RESOURCES_INTRO =
  'Rainbow Circuits is a place to be seen and supported — but some things are bigger than any community can hold on its own. If you or someone you care about is struggling, here are places staffed by people trained to help. You are always welcome here, and you deserve support beyond here too.';

export const EMERGENCY_CALLOUT = {
  title: 'If you’re in immediate danger',
  body: 'Please contact your local emergency services right now, or a crisis line in your country. Rainbow Circuits is a caring community, but it is not a crisis service and cannot provide emergency help.',
};

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: 'Find help near you',
    emoji: '🌍',
    blurb: 'Not sure where to start, or outside the US/UK? This directory finds free, confidential support lines in your country.',
    resources: [
      {
        name: 'Find A Helpline',
        description:
          'Search by country for free, confidential support you can call, text, or chat with — wherever you are in the world.',
        url: 'https://findahelpline.com',
        region: 'International',
      },
    ],
  },
  {
    title: 'LGBTQIA+ support',
    emoji: '🏳️‍🌈',
    blurb: 'Support from people who understand queer and trans experiences firsthand.',
    resources: [
      {
        name: 'The Trevor Project',
        description:
          'Crisis support for LGBTQ young people — by phone, text, and chat. See their site for current contact options and hours.',
        url: 'https://www.thetrevorproject.org',
        region: 'US',
      },
      {
        name: 'Trans Lifeline',
        description:
          'A peer support hotline run by and for trans people. Check their site for current numbers and hours.',
        url: 'https://translifeline.org',
        region: 'US & Canada',
      },
      {
        name: '[Add an LGBTQIA+ service for your region]',
        description:
          '[Replace with a verified LGBTQIA+ support service relevant to your members — e.g. a national helpline or community org.]',
        placeholder: true,
      },
    ],
  },
  {
    title: 'Mental health & crisis lines',
    emoji: '💜',
    blurb: 'For hard days, overwhelming feelings, or thoughts of self-harm.',
    resources: [
      {
        name: '988 Suicide & Crisis Lifeline',
        description:
          'Free, confidential support, 24/7. In the US you can call or text 988, or chat online — see their site for details.',
        url: 'https://988lifeline.org',
        region: 'US',
      },
      {
        name: '[Add a crisis or mental-health service for your region]',
        description:
          '[Replace with a verified crisis or mental-health service for your members’ country — the Find A Helpline directory above can help you locate one.]',
        placeholder: true,
      },
    ],
  },
];

export const COMMUNITY_NOTE =
  'Inside the community, gentler spaces like Wellness Wednesday and Puddle’s Pond are here whenever you want company — but they’re peer support between friends, not therapy. Lean on them for connection, and on the services above for care.';
