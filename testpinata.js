import { uploadJSON } from "./pinataClient.js";

const run = async () => {
  const cid = await uploadJSON({ message: "Hello from Pinata!" });
  console.log("Returned CID:", cid);
};
run();
