/**
 * Funding Connect Consulting — site-content.js
 *
 * Central placeholder content for the static site.
 *
 * Keep this file focused on words, labels, placeholder options and simple
 * content configuration. Components should handle markup/rendering only.
 */

"use strict";

window.FCC_CONTENT = {
  homeHero: {
    tag: "First Nations Funding Specialists",
    heading: "Connecting <em>communities</em><br />with funding that matters",
    text: "We support Aboriginal and Torres Strait Islander organisations to access funding opportunities and design programs that create lasting impact — led by community, for community.",
    actions: [
      {
        label: "Get in Touch",
        page: "connect",
        className: "btn btn-white",
        ariaLabel: "Get in touch with us",
      },
      {
        label: "Our Approach",
        page: "about",
        className: "btn btn-outline",
        ariaLabel: "Learn about our approach",
      },
    ],
  },

  grantsSection: {
    heading: "Recent Grant Opportunities",
    status: "Updated regularly",
    statusAriaLabel: "This section is updated regularly",
    trackAriaLabel: "Scrolling grant opportunities — hover to pause",
  },

  grants: [
    {
      category: "Health & Wellbeing",
      title: "Indigenous Health & Wellbeing Fund",
      amount: "Up to $150,000",
      close: "Closes 30 Jun 2026",
    },
    {
      category: "Education",
      title: "First Nations Education Support Grants",
      amount: "Up to $80,000",
      close: "Closes 15 Jul 2026",
    },
    {
      category: "Economic Development",
      title: "Indigenous Business Australia – Growth Fund",
      amount: "$50,000 – $500,000",
      close: "Open rolling",
    },
    {
      category: "Housing",
      title: "Remote Housing Infrastructure Program",
      amount: "Up to $2,000,000",
      close: "Closes 1 Aug 2026",
    },
    {
      category: "Culture & Arts",
      title: "AIATSIS Community Heritage Grants",
      amount: "Up to $30,000",
      close: "Closes 20 Jul 2026",
    },
    {
      category: "Youth",
      title: "Strong Communities Youth Development",
      amount: "Up to $120,000",
      close: "Closes 31 Aug 2026",
    },
    {
      category: "Environment",
      title: "Land & Sea Country Ranger Program",
      amount: "Up to $250,000",
      close: "Open rolling",
    },
    {
      category: "Governance",
      title: "Governance & Capability Support Fund",
      amount: "Up to $60,000",
      close: "Closes 14 Sep 2026",
    },
  ],

  homeBlurb: {
    heading: "Specialist support for First Nations organisations",
    paragraphs: [
      "Funding Connect Consulting was founded to ensure Aboriginal and Torres Strait Islander organisations have the expert support they need to secure funding and deliver meaningful programs.",
      "We bring deep knowledge of the funding landscape — government, philanthropic and corporate — combined with genuine respect for community-led decision making and cultural values.",
    ],
    finalParagraph:
      "Whether you're searching for your first grant or scaling an established program, we walk alongside you every step of the way.",
    link: {
      label: "Learn more about us →",
      page: "about",
      ariaLabel: "Learn more about Funding Connect Consulting",
    },
    missionCard: {
      quote:
        "Bridging funding with the meaningful work of Aboriginal and Torres Strait Islander communities.",
      cite: "Our Mission",
    },
  },

  pageBanners: {
    about: {
      tag: "Who We Are",
      heading: "Built on Connection,<br />Trust &amp; Impact",
      text: "A consulting practice dedicated to strengthening Aboriginal and Torres Strait Islander organisations across Australia.",
    },
    services: {
      tag: "What We Do",
      heading: "Our Services",
      text: "Specialist consulting designed around the unique needs and aspirations of Aboriginal and Torres Strait Islander communities.",
    },
    connect: {
      tag: "Get in Touch",
      heading: "Let's Connect",
      text: "Whether you're starting your funding journey or need specialist support, we're here to help.",
    },
  },

  aboutIntro: [
    "Funding Connect Consulting was founded with one purpose — to ensure Aboriginal and Torres Strait Islander organisations have the expert support they need to access funding and deliver programs that truly serve their communities.",
    "We understand that funding is not just about dollars. It is about enabling self-determination, preserving culture, and creating change that is led by community, for community.",
    "Our team brings together deep experience in grant writing, program design, stakeholder engagement and evaluation — all grounded in genuine respect for First Nations peoples and their ways of working.",
  ],

  valuesSection: {
    heading: "Our Values",
  },

  values: [
    {
      title: "Self-Determination",
      text: "Community voices lead every process.",
    },
    {
      title: "Cultural Safety",
      text: "Deep respect for Country and culture always.",
    },
    {
      title: "Transparency",
      text: "Honest, practical advice you can rely on.",
    },
    {
      title: "Accountability",
      text: "We answer to the communities we serve.",
    },
    {
      title: "Long-term Thinking",
      text: "Building capability, not dependency.",
    },
  ],

  pillarsSection: {
    ariaLabel: "Our three pillars",
  },

  pillars: [
    {
      title: "Connection",
      text: "Linking organisations with the right opportunities, partners and networks to maximise their reach and impact.",
      icon: "people",
    },
    {
      title: "Trust",
      text: "Built through honest relationships, cultural respect and always putting community first in everything we do.",
      icon: "heart",
    },
    {
      title: "Impact",
      text: "Measurable outcomes that strengthen communities and support wellbeing across generations.",
      icon: "shield",
    },
  ],

  acknowledgements: {
    title: "Acknowledgement of Country",
    full: "We acknowledge the Traditional Custodians of Country throughout Australia and recognise their continuing connection to Land, Water and Community. We pay our respects to Elders past, present and emerging.",
    short:
      "We acknowledge the Traditional Custodians of Country throughout Australia and their continuing connection to Land, Water and Community.",
  },

  servicesSection: {
    ariaLabel: "Our services",
  },

  services: [
    {
      title: "Funding Identification",
      text: "We research and identify relevant government, philanthropic and corporate funding tailored to your organisation's goals and community priorities.",
      icon: "search",
    },
    {
      title: "Grant Writing",
      text: "Expert writers craft compelling, community-led applications that articulate your vision powerfully and satisfy funder requirements.",
      icon: "document",
    },
    {
      title: "Program Design",
      text: "We co-design culturally grounded programs alongside your community — evidence-informed, measurable and genuinely impactful.",
      icon: "monitor",
    },
    {
      title: "Stakeholder Engagement",
      text: "Meaningful consultation and partnership development with government, community and sector stakeholders.",
      icon: "people",
    },
    {
      title: "Monitoring & Evaluation",
      text: "Robust M&E frameworks that capture real impact and satisfy funder reporting — without the burden on your team.",
      icon: "pulse",
    },
    {
      title: "Capacity Building",
      text: "Workshops, mentoring and tailored training so your team has the skills to thrive long after our engagement ends.",
      icon: "shield",
    },
  ],

  processSection: {
    heading: "How we work",
    ariaLabel: "Our four-step process",
  },

  processSteps: [
    {
      number: "01",
      title: "Listen",
      text: "We start by understanding your community, vision and specific needs — no assumptions.",
    },
    {
      number: "02",
      title: "Identify",
      text: "We map the funding landscape and pinpoint opportunities aligned to your priorities.",
    },
    {
      number: "03",
      title: "Develop",
      text: "We co-create compelling applications and program designs grounded in your community's story.",
    },
    {
      number: "04",
      title: "Support",
      text: "We stay alongside you through reporting, evaluation and planning for future rounds.",
    },
  ],

  contactIntro: {
    heading: "We'd love to hear from you",
  },

  contactInfo: [
    {
      label: "Email",
      value: "hello@fundingconnect.com.au",
      href: "mailto:hello@fundingconnect.com.au",
      icon: "email",
    },
    {
      label: "Phone",
      value: "(07) XXXX XXXX",
      href: "tel:+61700000000",
      icon: "phone",
    },
    {
      label: "Location",
      value: "Brisbane, Queensland",
      icon: "location",
    },
  ],

  contactForms: {
    tabsAriaLabel: "Contact form options",
    tabs: [
      {
        id: "enquiry",
        label: "Submit Enquiry",
      },
      {
        id: "newsletter",
        label: "Newsletter",
      },
    ],

    enquiry: {
      formAction: "https://formspree.io/f/mdabygob",
      formMethod: "POST",
      embedHeading: "Start your enquiry",
      embedBody:
        "Share a few details about the support you need and the Funding Connect Consulting team will be in touch within 2 business days.",
      successMessage:
        "Thank you for reaching out. Your enquiry has been received and a member of the Funding Connect Consulting team will be in touch within 2 business days.",
      submitLabel: "Send Enquiry",
      submitAriaLabel: "Send your enquiry",
      fields: [
        {
          type: "hidden",
          name: "_subject",
          value: "New Funding Connect Consulting enquiry",
        },
        {
          type: "hidden",
          name: "_next",
          value: "",
        },
        {
          type: "hidden",
          name: "_gotcha",
          value: "",
        },
        {
          id: "e-name",
          label: "Full Name",
          type: "text",
          name: "full_name",
          placeholder: "Your name",
          autocomplete: "name",
          required: true,
        },
        {
          id: "e-org",
          label: "Organisation Name",
          type: "text",
          name: "organisation",
          placeholder: "Organisation name",
          autocomplete: "organization",
          required: false,
        },
        {
          id: "e-email",
          label: "Email",
          type: "email",
          name: "email",
          placeholder: "your@email.com",
          autocomplete: "email",
          required: true,
        },
        {
          id: "e-phone",
          label: "Phone",
          type: "tel",
          name: "phone",
          placeholder: "(07) XXXX XXXX",
          autocomplete: "tel",
        },
        {
          id: "e-service-needed",
          label: "Service Needed",
          type: "select",
          name: "service_needed",
          placeholder: "Select a service...",
          required: false,
          options: [
            {
              value: "funding-identification",
              label: "Funding Identification",
            },
            { value: "grant-writing", label: "Grant Writing" },
            { value: "program-design", label: "Program Design" },
            {
              value: "stakeholder-engagement",
              label: "Stakeholder Engagement",
            },
            {
              value: "monitoring-evaluation",
              label: "Monitoring & Evaluation",
            },
            { value: "capacity-building", label: "Capacity Building" },
            { value: "not-sure", label: "Not sure yet" },
          ],
        },
        {
          id: "e-msg",
          label: "Message",
          type: "textarea",
          name: "message",
          placeholder:
            "Tell us a little about what support you need and we will get back to you.",
          required: true,
        },
        {
          id: "e-consent",
          label: "Consent",
          type: "checkbox",
          name: "consent",
          checkboxLabel:
            "I consent to Funding Connect Consulting using these details to respond to my enquiry.",
          required: true,
        },
      ],
      note: "Funding Connect Consulting collects your details so we can respond to your enquiry and provide relevant support. Please share only the information needed for us to understand and respond to your request.",
    },

    newsletter: {
      intro:
        "Subscribe for occasional funding, grant writing and program design updates.",
      note: "By subscribing, you agree to receive occasional updates from Funding Connect Consulting. You can unsubscribe at any time.",
      embedHeading: "Stay connected",
      embedBody:
        "Join the Funding Connect Consulting newsletter for occasional updates on funding opportunities, grant writing insights and program design ideas.",
    },
  },
};
