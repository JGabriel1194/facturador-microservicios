import { signDocument } from "../utils/digitalSignature.js";

const signInvoice = async (req, res) => {
  try {
    const { document } = req.body;

    if (!document) {
      return res
        .status(400)
        .json({ success: false, message: "Document is required" });
    }

    const signedDocument = await signDocument(document);

    res.status(200).json({
      success: true,
      signedDocument,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default signInvoice ;
