# Love Letter

A small romantic website with an animated envelope, typewriter text, floating hearts and a soft sound toggle.

## How to edit

Open `script.js` and change the `CONFIG.pages` array:

```js
pages: [
  {
    title: "Привет.",
    text: "Твой текст письма..."
  }
]
```

You can add more pages by adding more objects to the array.

## Run locally

```bash
uv run python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```