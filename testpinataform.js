// testPinataForm.js
import dotenv from "dotenv";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { fetch } from "undici";
import fs from "fs";

dotenv.config({ quiet: true });

async function main() {
  const filePath = "./iot 4.txt"; // put the exact path or copy file into project root as this name
  if (!fs.existsSync(filePath)) {
    console.error("ERROR: file not found at", filePath);
    process.exit(1);
  }

  const form = new FormData();
  const file = await fileFromPath(filePath, "iot 4.txt", { type: "text/plain" });
  form.set("file", file);
  form.set("pinataMetadata", JSON.stringify({ name: "iot 4.txt" }));
  form.set("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  // Print headers the FormData will use
  console.log("Form headers object:");
  console.log(form.headers);

  // Print the keys to confirm field names
  console.log("Form keys:", Array.from(form.keys()));

  // do the request
  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
      ...form.headers
    },
    body: form
  });

  console.log("HTTP status:", res.status, res.statusText);
  const text = await res.text();
  console.log("Response body:\n", text);
}

main().catch(err => {
  console.error("Script error:", err && err.stack ? err.stack : err);
  process.exit(1);
});
