import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let serviceAccount;

// 🔹 If running on Render (env variable exists)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.log("🔥 Using Firebase from ENV variable");
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // 🔹 If running locally (use JSON file)
  console.log("🔥 Using Firebase from local JSON file");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, "firebase-service-account.json");

  serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
