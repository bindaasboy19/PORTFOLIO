# Cinematic Dynamic Portfolio Website

A premium personal portfolio website built with semantic HTML, modern CSS, and modular vanilla JavaScript. The interface is designed to feel like it is being written live: the hero content types in line by line, sections unlock progressively from top to bottom, and scroll-driven animations reveal content without blocking interaction.

## Features

- Cinematic hero section with custom multi-line typewriter animation and blinking cursor
- Progressive section reveal system that unlocks content from top to bottom without freezing scroll
- Sticky navbar with active section highlighting and smooth scrolling
- Dark/light mode with `localStorage` persistence and smooth visual transitions
- Dynamic projects section powered by `fetch()` from `data/projects.json`
- Project filters by tech stack
- Staggered project-card animations with hover zoom, glow, and button emphasis
- About section with animated skill tags, progress meters, and a vertical timeline
- Contact form with required-field checks, regex email validation, animated feedback, and no page reload
- Responsive layout optimized for mobile, tablet, and desktop

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Google Fonts
- Font Awesome

## Animation System

### `js/typing.js`

- Runs a custom non-blocking typewriter engine for multiple hero lines
- Uses randomized speed ranges for more natural typing
- Reveals CTA content after the hero sequence completes

### `js/animations.js`

- Handles the minimal boot indicator
- Progressively unlocks sections from top to bottom
- Uses `IntersectionObserver` for fade, slide, scale, and staggered card reveals
- Falls back gracefully for reduced-motion users

### `js/projects.js`

- Fetches `data/projects.json`
- Normalizes project data before rendering
- Supports loading, empty, and error states
- Applies staggered animation delays to project cards

## Folder Structure

```text
portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── animations.js
│   ├── main.js
│   ├── projects.js
│   ├── theme.js
│   └── typing.js
├── data/
│   └── projects.json
├── assets/
│   ├── images/
│   │   └── profile.jpg
│   └── resume.pdf
└── README.md
```

## How to Run Locally

Because the projects are loaded through `fetch()`, run the site with a local server instead of opening `index.html` directly.

1. Open the project folder in your terminal.
2. Start a static server:

```bash
python3 -m http.server 8000
```

3. Open `http://localhost:8000` in your browser.

## EmailJS Setup

To make the contact form send real emails:

1. Create an EmailJS account and connect an email service.
2. Create an email template in EmailJS.
3. Open [index.html](/Users/sanjeevchaurasia/ArmbhTech/Portfolio/index.html) and replace these form attributes:

```html
data-emailjs-service-id="YOUR_SERVICE_ID"
data-emailjs-template-id="YOUR_TEMPLATE_ID"
data-emailjs-public-key="YOUR_PUBLIC_KEY"
```

4. In your EmailJS template, use these variables:

- `{{from_name}}`
- `{{reply_to}}`
- `{{message}}`
- `{{title}}`
- `{{source}}`
- `{{time}}`

## Editing `projects.json`

Each project object can include:

```json
{
  "title": "Project Name",
  "description": "Short project summary",
  "tech": ["HTML", "CSS", "JavaScript"],
  "github": "https://github.com/your-repo",
  "live": "https://your-demo-url.com",
  "status": "Completed"
}
```

Notes:

- `title`, `description`, and `tech` are the main display fields.
- `github` and `live` are optional in the renderer. If they are missing, the UI shows an upcoming state instead of breaking.
- `status` can be written as `status` or `Status`.

## Deployment

### GitHub Pages

1. Push the project to a GitHub repository.
2. Open repository settings.
3. Go to **Pages**.
4. Choose the main branch root as the source.
5. Save and wait for the deployment URL.

### Netlify

1. Create a new site from your Git repository.
2. Keep the publish directory as the project root.
3. No build command is required.
4. Deploy.

## Customization Notes

- Replace `assets/resume.pdf` with your actual resume before publishing.
- Update the biography, timeline, and contact copy inside `index.html`.
- Add or remove projects by editing only `data/projects.json`.
- Swap the profile image in `assets/images/` if you want a different portrait or custom artwork.
