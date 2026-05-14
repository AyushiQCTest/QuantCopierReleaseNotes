# QuantCopier Release Notes

This is the release notes and changelog page for QuantCopier, a Telegram-to-MT5 signal copier application.

## Project Structure

```
QuantCopierReleaseNotes/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Changelog page with all releases
│   └── globals.css        # Global styles
├── package.json           # Dependencies and scripts
├── next.config.mjs        # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── firebase.json          # Firebase Hosting configuration
└── README.md             # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd QuantCopierReleaseNotes
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Firebase Hosting

#### Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Domain configured (releases.quanttradertools.com)

#### Deployment Steps

```bash
# Login to Firebase
firebase login

# Initialize Firebase in this project (if not already done)
firebase init hosting

# Deploy to Firebase
npm run deploy
```

Or manually:

```bash
npm run build
firebase deploy --only hosting
```

## Configuration

### Firebase Project Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project named `QuantCopier` or similar

2. **Set Up Hosting**
   ```bash
   firebase init hosting
   ```
   - Choose your project
   - Use `.next/standalone/public` as the public directory (or `.` after build)
   - Configure as single-page app: **No**
   - Don't overwrite `firebase.json`

3. **Add Custom Domain**
   - In Firebase Console → Hosting → Add Custom Domain
   - Enter: `releases.quanttradertools.com`
   - Follow DNS verification steps
   - Update your domain registrar DNS settings

### Environment Variables

No environment variables needed for this release notes page.

## Adding New Releases

Edit `app/page.tsx` and add new release entries to the `releases` array:

```typescript
{
  version: '1.3.0',
  date: 'January 15, 2025',
  title: 'Feature Title',
  description: 'What this release is about',
  features: ['Feature 1', 'Feature 2'],
  fixes: ['Bug fix 1', 'Bug fix 2'],
  improvements: ['Improvement 1'],
}
```

## Styling

The page uses:
- **Framework**: Next.js 16.1.0 with React 19
- **Styling**: Tailwind CSS (via `globals.css`)
- **Icons**: Lucide React

Colors:
- Primary: Blue (`#3b82f6`)
- Background: Slate gray (`#0f172a` to `#1e293b`)
- Text: Light slate (`#e2e8f0`)

## Integration with QuantCopierUI

The link in ProfileDropdown.tsx (`components/home/ProfileDropdown.tsx`) points to:
```
https://releases.quanttradertools.com
```

No changes needed in the main app after Firebase deployment.

## Troubleshooting

### DNS_PROBE_FINISHED_NXDOMAIN

- Domain not configured in Firebase Hosting
- DNS changes not propagated yet (can take 24-48 hours)
- Verify in Firebase Console that domain shows as "Connected"

### Deploy Fails

- Ensure you're logged in: `firebase login`
- Check project is selected: `firebase use --add`
- Build first: `npm run build`

### Page Not Loading

- Check `.next` build output exists
- Verify `firebase.json` routing configuration
- Check Firebase Hosting logs in console

## Support

- Email: support@quanttradertools.com
- Repository: https://github.com/yourusername/QuantCopierReleaseNotes

## License

Copyright © 2025 QuantTraderTools. All rights reserved.
