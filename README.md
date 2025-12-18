# Brightcove Poster Overlay Plugin

A lightweight Brightcove Player (Video.js) plugin that shows the media asset's poster image as a full-player overlay while a livestream is waiting to start. The overlay fades out automatically as soon as playback begins, letting the live feed show through.

## Files
- `poster-overlay.js` – JavaScript plugin that reads the asset's poster image (or an optional override) and hides itself when the player fires playback events.
- `poster-overlay.css` – Styling to center the poster image and smoothly fade it away.

## How it works
- On player ready, the plugin pulls the poster URL from (in order):
  1. A `poster` option passed to the plugin.
  2. `player.mediainfo.poster` (the media asset's poster image in Brightcove).
  3. `player.poster()` as a final fallback.
- The poster image is shown as an overlay on top of the player.
- When the player emits `playing` (configurable), the overlay fades out so the livestream is visible.
- On new sources (`loadstart`), the overlay shows again and updates the poster after metadata loads.

## Usage with a Brightcove Player
1. Host `poster-overlay.js` and `poster-overlay.css` on a location accessible to your player (e.g., your CDN or the Brightcove Media module). 
2. In Video Cloud Studio, open **Players → Plugins** for the player you want to update.
3. Add a **Custom Plugin**:
   - **Name:** `posterOverlay`
   - **JavaScript URL:** URL where you host `poster-overlay.js`
   - **CSS URL:** URL where you host `poster-overlay.css`
4. (Optional) Add plugin options JSON. Example:

```json
{
  "poster": "https://example.com/override-poster.jpg",
  "hideOnEvents": ["playing", "loadstart"]
}
```

If you omit `poster`, the plugin uses the media asset's poster. You can adjust `hideOnEvents` to control which player events hide the overlay.

## Local testing snippet
If you are testing locally, include the plugin files after the Brightcove Player embed script and initialize the plugin:

```html
<link rel="stylesheet" href="/path/to/poster-overlay.css">
<script src="https://players.brightcove.net/{account_id}/{player_id}_default/index.min.js"></script>
<script src="/path/to/poster-overlay.js"></script>
<script>
  videojs.getPlayer('{player_id}').posterOverlay();
</script>
```

Replace `{account_id}` and `{player_id}` with your player values.
