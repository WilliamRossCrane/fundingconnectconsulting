# 🌿 Acknowledgement of Country

Funding Connect Consulting acknowledges the Traditional Custodians of Country throughout Australia and recognises their continuing connection to Land, Water and Community.

We pay our respects to Elders past, present and emerging.

---

# 🌱 Funding Connect Consulting Website

![Project Status](https://img.shields.io/badge/status-complete-brightgreen)
![Vercel Ready](https://img.shields.io/badge/deployment-vercel-black)
![Static Site](https://img.shields.io/badge/build-static%20site-blue)
![Grant Updates](https://img.shields.io/badge/grants-automated-orange)

This project is my first completed **vibe coding** website and was developed for a real business, **Funding Connect Consulting**. Because this website represents a real organisation, the business name, content, branding and related data are not available for reuse.

The website is for **Funding Connect Consulting**, a First Nations-focused consulting business that supports Aboriginal and Torres Strait Islander organisations with funding opportunities, grant writing, program design and community-led impact.

The goal of this project was to create a professional, accessible and easy-to-maintain static website that can be launched through **Vercel** and supported with automated grant opportunity updates.

![HTML](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

# 📌 Project Overview

Funding Connect Consulting is designed to help connect Aboriginal and Torres Strait Islander organisations with funding that supports meaningful, community-led outcomes.

The website includes:

- A professional landing page
- An About section explaining the company’s purpose and values
- A Services section outlining consulting support areas
- A Connect page with enquiry and newsletter forms
- A dynamic grants carousel powered by generated grant data
- Automated grant data updates using a scheduled GitHub Action
- Responsive styling for desktop, tablet and mobile
- A clean static setup ready for Vercel deployment

The project is complete as a static website and has been structured so it can be maintained and expanded over time.

---

# ✅ Completed Features

- Professional static website for Funding Connect Consulting
- Responsive Home, About, Services and Connect sections
- First Nations-focused content and business positioning
- Grant opportunities carousel
- Automated grant data generation into `data/grants.json`
- Scheduled GitHub Action for updating grant data
- Clickable grant cards linking to official grant pages
- Contact and newsletter form layouts
- Welcome popup component
- Refactored component structure for easier maintenance
- Organised CSS structure with feature-based style files
- Vercel deployment configuration

---

# 🔄 Future Improvements

Potential future improvements include:

- Connecting enquiry forms to a production form service
- Connecting newsletter subscriptions to a live email platform
- Expanding grant source coverage where reliable public sources are available
- Adding more resource pages or downloadable guides
- Further SEO improvements
- Adding analytics or basic performance monitoring

---

# ⚙️ Tech Stack

**HTML** – Website structure and content  
**CSS** – Styling, layout, responsive design and animations  
**JavaScript** – Page switching, tabs, form interactions and grants carousel  
**Node.js** – Grant data fetching and generation script  
**GitHub Actions** – Scheduled grant data updates  
**Vercel** – Static website deployment

---

# 🔋 Current Features

👉 **Responsive Landing Page**  
A clean hero section introducing Funding Connect Consulting and its purpose.

👉 **Multi-Section Layout**  
Includes Home, About, Services and Connect sections.

👉 **Automated Grant Opportunities Carousel**  
Displays grant opportunities from generated grant data, with official source links.

👉 **Services Overview**  
Outlines consulting services such as grant writing, program design and capacity building.

👉 **Contact and Newsletter Forms**  
Includes front-end form layouts for enquiries and newsletter subscriptions.

👉 **Mobile-Friendly Design**  
Responsive layout for smaller screens.

👉 **Scheduled Grant Data Updates**  
Uses a GitHub Action to run the grant update script and refresh `data/grants.json`.

---

# 🧠 Learning Outcomes

This project helped me practise:

- Vibe coding workflows
- Building and organising static websites
- Creating responsive layouts
- Structuring HTML, CSS and JavaScript projects
- Refactoring components into clearer feature-based files
- Working with generated JSON data
- Using Node.js scripts for static-site data updates
- Setting up scheduled GitHub Actions
- Improving front-end design and accessibility
- Preparing a static website for Vercel deployment

---

# 📁 Project Structure

```bash
funding-connect-consulting/
├── index.html
├── vercel.json
├── README.md
├── .editorconfig
├── .gitignore
├── .prettierrc
│
├── .github/
│   └── workflows/
│       └── update-grants.yml
│
├── assets/
│   ├── icons/
│   │   ├── favicon.svg
│   │   ├── favicon.png
│   │   └── apple-touch-icon.png
│   │
│   └── images/
│       └── og-image.png
│
├── components/
│   ├── contact.js
│   ├── dom.js
│   ├── grants-carousel.js
│   ├── home.js
│   ├── layout.js
│   └── welcome-popup.js
│
├── data/
│   ├── grants.json
│   └── site-content.js
│
├── scripts/
│   ├── grant-sources/
│   ├── app.js
│   ├── fetch-grants.js
│   ├── forms.js
│   ├── grants.js
│   ├── router.js
│   ├── tabs.js
│   └── utils.js
│
└── styles/
    ├── main.css
    ├── tokens.css
    ├── base.css
    ├── layout.css
    ├── components.css
    ├── pages.css
    ├── grants.css
    ├── utilities.css
    └── welcome-popup.css
```

---

# 🔒 Usage & Content Notice

This website is being developed for a real business: **Funding Connect Consulting**.

The business name, branding, written content, service descriptions, contact details, grant information, cultural statements and any business-related data are not open-source and may not be copied, reused, republished or adapted without permission.

The code structure may be used as a personal learning reference only, but the business content and identity belong to Funding Connect Consulting.

Please do not reuse any real business information, wording, branding or data from this project.

---

# 📄 Licence

This repository is shared for learning and development purposes only.

All business content, branding, copy, service information and related data are proprietary to **Funding Connect Consulting** and may not be reused without permission.
