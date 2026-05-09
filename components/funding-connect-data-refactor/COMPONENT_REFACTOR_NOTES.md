# Component Refactor Notes

This refactor keeps the project as static HTML, CSS and vanilla JavaScript.

## What changed

- `index.html` keeps the main page containers but uses placeholders for repeated sections.
- `styles.css` was copied over unchanged.
- `script.js` keeps routing, tab switching and form handling.
- Grants carousel rendering was moved out of `script.js` into `components/grants-carousel.js`.
- Repeated cards/sections were moved into flat component files.

## Component structure

```txt
components/
  dom.js
  page-banner.js
  grants-carousel.js
  values.js
  pillars.js
  acknowledgement.js
  services-grid.js
  process-steps.js
  contact-info.js
```

Keep your existing files in place:

```txt
components/navbar.js
components/footer.js
components/welcome-popup.js
components/welcome-popup.css
```

Those files were referenced by the original project but were not included in the uploaded files, so this refactor leaves their references intact.
