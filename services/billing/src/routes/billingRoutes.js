import express from "express";
import billingController from "../controllers/billingController.js";
import uploadMiddleware from "../middleware/uploadMidleware.js";

const router = express.Router();

router.get("/", billingController.getInvoices);
router.post("/", billingController.createInvoice);
router.post('/sign', uploadMiddleware, billingController.signInvoiceXml);
router.post('/send/:id', billingController.sendInvoiceToSRI);
router.post('/authorization/:key', billingController.getAuthorization)

export default router;