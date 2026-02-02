# mblock

mblock is a Chrome extension that helps you stay focused by blocking distracting websites during specific time ranges. Set your productive hours, add websites you want to block, and mblock will prevent access during those times.

## Features

- **Time-based blocking**: Set start and end times when blocking should be active
- **Custom URL blocking**: Add any URL patterns you want to block
- **Real-time blocking**: Instantly blocks pages that match your patterns during active hours
- **Simple management**: Easy-to-use popup UI for managing blocked sites and time settings
- **Persistent storage**: Your settings and blocked URLs are saved locally
- **Dynamic rule updates**: Add or remove blocking rules on the fly

Quick install (local development)

1. Install dev dependencies:

```powershell
npm install
```

2. Build the extension (TypeScript -> `dist/`):

```powershell
npm run build
```

3. Load the extension in Chrome/Edge:

- Open `chrome://extensions` (or `edge://extensions`).
- Enable "Developer mode".
- Click "Load unpacked" and choose this repository folder.

## Usage

1. **Set your focus hours**: Click the extension icon and set the start and end times for when you want blocking to be active
2. **Add websites to block**: Enter a URL (e.g., `https://youtube.com` or `https://twitter.com`) and click "Add"
3. **Manage your list**: View all blocked URLs and remove them individually as needed
4. **Stay focused**: During your specified time range, any attempt to visit blocked sites will show a "page blocked" message

### URL Pattern Examples
- `https://youtube.com` - Blocks all YouTube pages (e.g., https://youtube.com, https://youtube.com/watch?v=...)
- `https://twitter.com` - Blocks all Twitter pages
- `https://reddit.com` - Blocks all Reddit pages
- `https://facebook.com` - Blocks all Facebook pages

**Note**: The extension uses simple prefix matching. Any page URL that starts with your entered URL will be blocked.

## How It Works

- **Content Script**: Runs on every page at document start, checks if the current URL should be blocked based on time and saved patterns
- **Background Service Worker**: Manages dynamic blocking rules via `declarativeNetRequest` API
- **Time-based Control**: Only blocks during your specified time range (e.g., 9:00 AM to 5:00 PM)
- **Local Storage**: All settings are stored locally in your browser

## Permissions

- `declarativeNetRequest`: Create and manage URL blocking rules
- `storage`: Persist blocked URLs and time settings locally
- `host_permissions` (`<all_urls>`): Allow the content script to check and block pages on all websites

## Development Notes

- **Source files**: TypeScript files in `src/` (`background.ts`, `content.ts`, `popup.ts`)
- **Build output**: Compiled JavaScript in `dist/` folder
- **Manifest V3**: Uses modern Chrome extension APIs
- **Architecture**: 
  - `background.ts`: Handles dynamic rule management via messages from popup
  - `content.ts`: Performs real-time page blocking based on URL patterns and time range
  - `popup.ts`: Manages UI interactions, storage, and settings

## Publishing

- Replace placeholder icons in the `icons/` folder (16px, 48px, 128px) before publishing
- Update `manifest.json` fields (name, description, version) as appropriate
- Test thoroughly across different times of day to ensure blocking activates/deactivates correctly
- Consider adding more features like:
  - Multiple time ranges per day
  - Different schedules for weekdays/weekends
  - Break periods within blocking hours
  - Import/export blocked URL lists

## Contributing

Feel free to open issues or pull requests. Keep changes focused and include build/test notes.

## License

(Add license information here if desired.)
