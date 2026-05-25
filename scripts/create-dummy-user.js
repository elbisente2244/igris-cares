// Simple script to create a Firebase Auth user using the REST API.
// Usage:
//   EMAIL=admin@example.com PASSWORD=Password123! node scripts/create-dummy-user.js
// If no env vars provided, defaults are used (dev-only).

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB-ccN0wKGvnRbORyyGnpcQJ8vEmT5aa-g";
const email = process.env.EMAIL || "admin+dev@igriscares.local";
const password = process.env.PASSWORD || "Password123!";
const displayName = process.env.NAME || "Dev Admin";

async function createUser() {
  const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

  const res = await fetch(signUpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Failed to create user:", data);
    process.exit(1);
  }

  console.log("User created:", { email, localId: data.localId });

  // Set displayName using accounts:update
  if (data.idToken) {
    const updateUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
    const upd = await fetch(updateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: data.idToken, displayName, returnSecureToken: false }),
    });
    const updJson = await upd.json();
    if (!upd.ok) {
      console.error("User created but failed to update profile:", updJson);
    } else {
      console.log("User profile updated:", { displayName: updJson.displayName });
    }
  }
}

createUser().catch((e) => {
  console.error(e);
  process.exit(1);
});
