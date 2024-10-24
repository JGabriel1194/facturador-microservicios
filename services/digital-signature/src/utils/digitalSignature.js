import fs from "fs";
import path from "path";
import crypto from "crypto";

export const signDocument = async (document) => {
  try {
    const privateKeyPath = path.resolve("certificates/privateKey.pem");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const signer = crypto.createSign("SHA256");
    signer.update(document);
    signer.end();

    const signature = signer.sign(privateKey, "hex");

    return { document, signature };
  } catch (error) {
    throw new Error("Error signing document: " + error.message);
  }
};
