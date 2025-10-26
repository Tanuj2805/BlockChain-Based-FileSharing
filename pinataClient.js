// pinataClient.js (final working version with FormDataEncoder)
import dotenv from "dotenv";
import fs from "fs";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { FormDataEncoder } from "form-data-encoder";
import { fetch } from "undici";
import { Readable } from "stream";

dotenv.config({ quiet: true });

export async function uploadFileStream(filePath, fileName = "file", mime = "application/octet-stream") {
  try {
    // 1️⃣ Build the form data
    const form = new FormData();
    form.set("file", await fileFromPath(filePath, fileName, { type: mime }));
    form.set("pinataMetadata", JSON.stringify({ name: fileName }));
    form.set("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    // 2️⃣ Encode it properly
    const encoder = new FormDataEncoder(form);
    const headers = encoder.headers;

    // 3️⃣ Send the fetch request
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        ...headers, // includes multipart Content-Type with boundary
      },
      duplex:"half",
      body: Readable.from(encoder.encode()) // create stream from encoder
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Pinata upload failed: ${res.status} ${res.statusText}\n${text}`);

    const data = JSON.parse(text);
    console.log("✅ File pinned:", data.IpfsHash);
    return data.IpfsHash;
  } catch (err) {
    console.error("❌ File upload failed:", err.message);
    throw err;
  }
}

export async function uploadJSON(jsonData) {
  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify(jsonData),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Pinata JSON upload failed: ${res.status}\n${text}`);

    const data = JSON.parse(text);
    console.log("✅ JSON pinned:", data.IpfsHash);
    return data.IpfsHash;
  } catch (err) {
    console.error("❌ JSON upload failed:", err.message);
    throw err;
  }
}
