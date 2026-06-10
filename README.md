# Love Letter

Interactive romantic letter page.

## What it does

The page starts with a closed envelope. Click the envelope, it opens, moves closer to the bottom of the screen, and a large letter appears with a typewriter text effect. The letter can be closed with the round `×` button or with `Esc`.

## Files

```text
index.html
style.css
script.js
favicon.svg
README.md
```

## Run locally

```powershell
uv run python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

You can also open `index.html` directly in the browser, but the local server is better for testing before GitHub Pages.

## Change the phrase

Open `script.js` and edit this line:

```js
message: "You are my favorite place to come back to.",
```