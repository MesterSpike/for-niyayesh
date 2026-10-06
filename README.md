# A note for Niyayesh

A one-page letter from Arash: warm ivory stationery, an olive wax seal, and an animated envelope that opens into the letter. Designed for phones and desktop screens.

## Preview

Run `npm start`, then open <http://localhost:4173>. Node.js is only needed for the local preview and tests. The published website has no server or build step.

You can also open `index.html` directly in a browser.

## Edit the letter

The exact letter is in `index.html`, inside `<div class="letter-copy">`. Edit its paragraphs to change the wording. Keep the `<br>` tags for the three-line “upset / no / mad” passage.

- `styles.css` controls typography, colors, spacing, and envelope artwork.
- `app.js` controls opening, closing, focus, and reduced motion.
- `assets/` contains local fonts, texture, favicon, and GSAP.

## Publish on GitHub Pages

1. Push these files to your GitHub repository, keeping `index.html` at the root. Do not include `node_modules`.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the branch containing these files, select **/(root)**, and save.
5. Open the published link shown in Pages once deployment completes.

All asset paths are relative, so the page works under a repository path such as `/your-repository/`. No npm build, environment variables, or external font services are required.

[GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

The page asks search engines not to index it. This is a public static page, not password-protected storage.

## Verification

`npm ci` installs the test tools. `npm test` runs the browser checks using installed Google Chrome. To use Playwright's Chromium instead, install it with `npx playwright install chromium`, then run `PLAYWRIGHT_CHANNEL=chromium npm test`.

Nine tests cover five viewport sizes, exact letter text, opening and reopening, keyboard focus, reduced motion with an unavailable animation library, JavaScript-free reading, and local asset loading. See `docs/HANDOFF.md` for the verified state and remaining checks.

## Third-party assets

Cormorant Garamond and Outfit are bundled under the SIL Open Font License; their license files are in `assets/fonts/`. GSAP's distribution retains its upstream license notice in `assets/gsap.min.js`. The envelope and decorative SVGs are implemented within this project.
