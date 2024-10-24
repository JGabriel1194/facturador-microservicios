import express from "express";
import { signInvoice } from "../controllers/digitalSignatureController.js";

const router = express.Router();

// Ruta para firmar un documento
router.post("/sign-invoice", signInvoice);

export default router;
