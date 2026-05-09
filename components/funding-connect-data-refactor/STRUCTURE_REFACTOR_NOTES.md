# Structure Refactor Notes

This version keeps the project as a static HTML/CSS/vanilla JavaScript site, but separates UI components from app behaviour.

## Main changes

- Removed the old root-level `script.js`.
- Added a `scripts/` folder for focused app logic.
- Updated `index.html` to load scripts in this order:
  1. Component scripts from `components/`
  2. Behaviour scripts from `scripts/`
- Replaced main inline `onclick` handlers in `index.html` with data attributes:
  - `data-page-link`
  - `data-tab`
  - `data-submit-form`
- Kept global function names available for compatibility:
  - `showPage()`
  - `switchTab()`
  - `submitEnquiry()`
  - `submitNewsletter()`

## New scripts folder

```txt
scripts/
  utils.js     Shared helpers for form values, success messages and clearing fields
  router.js    SPA page switching and page-link event delegation
  tabs.js      Connect page tab switching
  forms.js     Enquiry and newsletter behaviour
  app.js       Initialises behaviour once the DOM is ready
```

## Existing component files

Your existing `navbar.js`, `footer.js`, `welcome-popup.js`, and `welcome-popup.css` should stay in `components/`.
