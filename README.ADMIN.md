Admin helper notes

Create a dummy Firebase Auth user for local development:

Run in Powershell:

```powershell
$env:EMAIL = "admin+dev@igriscares.local"
$env:PASSWORD = "Password123!"
node scripts/create-dummy-user.js
```

Or one-liner (PowerShell):

```powershell
EMAIL=admin+dev@igriscares.local PASSWORD=Password123! node scripts/create-dummy-user.js
```

Notes:
- The script uses the `NEXT_PUBLIC_FIREBASE_API_KEY` from your environment or the default in `lib/firebase/config.ts`.
- This creates a user in the Firebase project tied to that API key. Use the email/password to sign in at `/admin/login`.
- This is intended for local/dev use only. Do not commit service account keys or use this in production without proper safeguards.
