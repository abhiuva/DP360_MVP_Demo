const { Router } = require("express");
const {
  listFood,
  getPublicStoreDetails,
} = require("../controllers/client_compat.controller");

const router = Router();

router.get("/food/list", listFood);
router.get("/settings/public-store-details/:tenantId", getPublicStoreDetails);

module.exports = router;
