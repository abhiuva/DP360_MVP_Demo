import express from "express";
import { getPublicStoreDetails } from "../controllers/publicStoreController.js";

const router = express.Router();

router.get("/public-store-details/:tenantId", getPublicStoreDetails);

export default router;
