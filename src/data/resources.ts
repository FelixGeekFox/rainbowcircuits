/**
 * LGBTQIA+ support & wellbeing resources for the /resources/ page.
 *
 * IMPORTANT, before relying on anything here:
 *  - Verify every contact detail. Organisations, phone numbers, hours, and
 *    coverage areas change over time.
 *  - This page is peer/community information, NOT professional help.
 *  - Org names are shown as plain text unless a verified `url` is provided,
 *    so nobody is sent to the wrong site for a crisis service. Add a `url`
 *    only when you've confirmed it's the organisation's official website.
 */

export interface ResourceContact {
  /** e.g. "Phone", "Text", "WhatsApp", "LGBT National Hotline". */
  label?: string;
  /** The number or instruction, shown exactly as written. */
  value: string;
}

export interface ResourceLink {
  name: string;
  description: string;
  /** Only set to a verified official website. */
  url?: string;
  contacts?: ResourceContact[];
  /** Availability note, e.g. "Daily, 6:00–9:00 pm". */
  hours?: string;
  /** Extra note, e.g. "Online chat is also available.". */
  note?: string;
  placeholder?: boolean;
}

export interface ResourceGroup {
  title: string;
  emoji: string;
  blurb?: string;
  resources: ResourceLink[];
  /** Highlighted crisis line shown at the end of the group. */
  crisis?: string;
}

export const RESOURCES_INTRO =
  'You deserve support that respects your identity, experiences, and choices. The organisations below provide LGBTQIA+-affirming information, peer support, advocacy, counselling referrals, crisis assistance, and community connections.';

export const RESOURCES_DISCLAIMER =
  'Services may have eligibility requirements, opening hours, or regional limits. Please check the organisation’s website for its latest information.';

export const EMERGENCY_CALLOUT = {
  title: 'If you or someone else is in immediate danger',
  body: 'Contact your local emergency services right now. Rainbow Circuits is a caring community, but it is not a crisis service and cannot provide emergency help.',
};

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: 'International Resources',
    emoji: '🌍',
    resources: [
      {
        name: 'ILGA World',
        url: 'https://ilga.org',
        description:
          'A worldwide federation of LGBTQIA+ organisations providing reliable information about LGBTQIA+ rights, laws, advocacy, and community organisations across more than 170 countries. Its database allows users to explore legal protections and restrictions by country.',
      },
      {
        name: 'Rainbow Railroad',
        url: 'https://www.rainbowrailroad.org',
        description:
          'Supports LGBTQI+ people facing persecution because of their sexual orientation, gender identity, gender expression, or sex characteristics. People at risk can submit a request for assistance through the organisation’s website.',
      },
      {
        name: 'LGBT National Help Center Online Chat',
        url: 'https://www.lgbthotline.org',
        description:
          'Provides confidential peer support, affirmation, and referrals. Telephone services primarily cover the United States and Canada, while online chat can be accessed internationally.',
      },
      {
        name: 'Gender Dysphoria Bible',
        description:
          'An in-depth, accessible guide explaining what gender dysphoria is and the different ways it can be experienced — useful for understanding your own feelings or supporting someone you love.',
        url: 'https://genderdysphoria.fyi/en',
      },
    ],
  },
  {
    title: 'Canada',
    emoji: '🇨🇦',
    resources: [
      {
        name: 'Trans Lifeline Canada',
        url: 'https://translifeline.org',
        description: 'Peer support run by and for trans and questioning people.',
        contacts: [{ label: 'Phone', value: '877-330-6366' }],
      },
      {
        name: 'Kids Help Phone',
        url: 'https://kidshelpphone.ca',
        description:
          'Free, confidential mental health and crisis support for young people throughout Canada. Support is available by phone, live chat, online message, and text.',
        contacts: [
          { label: 'Phone', value: '1-800-668-6868' },
          { label: 'Text', value: 'CONNECT to 686868' },
        ],
      },
      {
        name: 'LGBT YouthLine',
        url: 'https://www.youthline.ca',
        description:
          'Free and anonymous peer support, information, and referrals for 2SLGBTQ+ people aged 29 and under in Ontario. Text and chat support are provided by trained 2SLGBTQ+ peers.',
      },
      {
        name: 'pflag Canada',
        url: 'https://pflagcanada.ca',
        description:
          'Peer support, education, resources, and community groups for 2SLGBTQIA+ people, families, caregivers, friends, and allies. Local and virtual chapters are available across Canada.',
      },
      {
        name: 'LGBT National Help Center',
        url: 'https://www.lgbthotline.org',
        description:
          'Confidential peer support and referrals for LGBTQIA+ people of all ages in the United States and Canada.',
        contacts: [
          { label: 'LGBT National Hotline', value: '888-843-4564' },
          { label: 'Coming Out Support Hotline', value: '888-688-5428' },
        ],
      },
    ],
    crisis: 'For urgent crisis support: call or text 988 anywhere in Canada.',
  },
  {
    title: 'United States',
    emoji: '🇺🇸',
    resources: [
      {
        name: 'The Trevor Project',
        url: 'https://www.thetrevorproject.org',
        description: 'Free, confidential, 24/7 crisis support for LGBTQ+ young people.',
        contacts: [
          { label: 'Phone', value: '1-866-488-7386' },
          { label: 'Text', value: 'START to 678678' },
        ],
        note: 'Online chat is also available.',
      },
      {
        name: 'Trans Lifeline US',
        url: 'https://translifeline.org',
        description: 'Peer support run by and for trans and questioning people.',
        contacts: [{ label: 'Phone', value: '877-565-8860' }],
      },
      {
        name: 'LGBT National Help Center',
        url: 'https://www.lgbthotline.org',
        description:
          'Confidential peer support, community connections, information, and referrals for LGBTQIA+ people of all ages.',
        contacts: [
          { label: 'LGBT National Hotline', value: '888-843-4564' },
          { label: 'Coming Out Support Hotline', value: '888-688-5428' },
        ],
      },
      {
        name: 'LGBT National Youth Talkline',
        url: 'https://www.lgbthotline.org',
        description:
          'Peer support for LGBTQIA+ young people dealing with identity, coming out, relationships, bullying, school, family, sexual health, or emotional distress.',
      },
      {
        name: 'LGBT National Senior Hotline',
        url: 'https://www.lgbthotline.org',
        description:
          'Confidential peer support and referrals for LGBTQIA+ older adults and people seeking support around ageing, identity, isolation, or discrimination.',
      },
    ],
    crisis:
      'For urgent crisis support: call or text 988 anywhere in the United States. The Trevor Project continues to operate its own independent LGBTQ+ youth crisis services.',
  },
  {
    title: 'Aotearoa New Zealand',
    emoji: '🇳🇿',
    resources: [
      {
        name: 'OutLine Aotearoa',
        url: 'https://outline.org.nz',
        description:
          'Free, confidential rainbow peer support provided by trained LGBTQIA+ volunteers. Counselling and additional trans and nonbinary support services are also available.',
        contacts: [{ label: 'Phone', value: '0800 688 5463' }],
        hours: 'Available daily from 6:00 pm to 9:00 pm.',
        note: 'Online chat is also available.',
      },
      {
        name: 'RainbowYOUTH',
        url: 'https://ry.org.nz',
        description:
          'Support, information, advocacy, resources, and community connection for queer, gender-diverse, takatāpui, and intersex young people, as well as their friends and whānau.',
      },
      {
        name: 'InsideOUT Kōaro',
        url: 'https://insideout.org.nz',
        description:
          'A national organisation supporting rainbow and takatāpui young people. It provides resources for young people, whānau, schools, workplaces, healthcare professionals, and community groups.',
      },
      {
        name: 'Gender Minorities Aotearoa',
        url: 'https://genderminorities.com',
        description:
          'A nationwide organisation run by and for transgender people. It offers information, advocacy, peer support, healthcare navigation, and counselling for trans people and their whānau.',
      },
    ],
  },
  {
    title: 'Spain',
    emoji: '🇪🇸',
    resources: [
      {
        name: 'Servicio Arcoíris 028',
        description:
          'Spain’s national LGBTQIA+ information and support service. It provides immediate psychosocial support, legal information, and assistance relating to discrimination, hate crimes, and anti-LGBTQIA+ violence. The service is free, confidential, and accessible by telephone, online chat, and email.',
        contacts: [{ label: 'Phone', value: '028' }],
      },
      {
        name: 'FELGTBI+ Línea Arcoíris',
        url: 'https://felgtbi.org',
        description:
          'An anonymous, confidential, and free information and referral service for LGBTQIA+ people, young people, and families. It can assist with hate crimes, discrimination, sexual health, HIV and STI information, asylum, documentation, and other LGBTQIA+ concerns.',
        contacts: [
          { label: 'Phone', value: '91 360 46 05' },
          { label: 'WhatsApp', value: '676 78 58 30' },
        ],
      },
      {
        name: 'FELGTBI+ Resource Centre',
        url: 'https://felgtbi.org',
        description:
          'A collection of Spanish-language educational resources, research, guides, videos, and information covering LGBTQIA+ inclusion, rights, health, families, and discrimination.',
      },
    ],
  },
  {
    title: 'Australia',
    emoji: '🇦🇺',
    resources: [
      {
        name: 'QLife',
        url: 'https://qlife.org.au',
        description:
          'Free and anonymous LGBTQIA+ peer support and referrals by telephone and webchat. QLife supports LGBTQIA+ people as well as friends, family members, teachers, and others seeking guidance.',
        contacts: [{ label: 'Phone', value: '1800 184 527' }],
        hours: 'Available daily from 3:00 pm to 9:00 pm local time.',
      },
      {
        name: 'Rainbow Door',
        url: 'https://www.rainbowdoor.org.au',
        description:
          'A free specialist helpline for LGBTQIA+ people, their friends, families, and professionals. It provides support, information, and referrals relating to mental health, relationships, family violence, homelessness, alcohol and other drugs, sexual health, and social connection. Interpreter and Auslan support are available.',
        contacts: [
          { label: 'Phone', value: '1800 729 367' },
          { label: 'Text', value: '0480 017 246' },
        ],
      },
      {
        name: 'Transcend Australia',
        url: 'https://transcend.org.au',
        description:
          'Support, information, advocacy, and resources for trans, gender-diverse, and nonbinary children, young people, and their families. Resources are also available for schools, healthcare professionals, and allies.',
      },
      {
        name: 'QLife QDirectory',
        description:
          'A searchable directory of LGBTQIA+-inclusive organisations, community services, healthcare providers, support groups, and specialist services throughout Australia.',
      },
      {
        name: 'Charlee',
        description:
          'An Australian LGBTQIA+ suicide-prevention hub containing information, practical guidance, and pathways to appropriate support. It is listed by QLife and Switchboard Victoria as an additional support resource.',
      },
    ],
    crisis:
      'For immediate danger: call 000. For broader crisis support, Lifeline Australia is available on 13 11 14.',
  },
];

export const GENTLE_REMINDER = {
  title: 'A Gentle Reminder',
  body: [
    'Rainbow Circuits is a peer community, not a crisis service, counselling provider, or substitute for professional healthcare. Members are welcome to seek kindness and connection here, but moderators and community members may encourage someone to contact an appropriate professional or crisis service when additional support is needed.',
    'You are never required to disclose your identity, experiences, or personal circumstances publicly in order to deserve help.',
  ],
};
