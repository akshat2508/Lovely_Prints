import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";
import { adminGetOrganisations , getShopsByOrganisation , toggleShopStatus , getOrganisationAnalytics , getShopAnalytics , getShopOrders} from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/organisations",
  authMiddleware,
  requireRole("admin"),
  adminGetOrganisations
);


router.get(
  "/organisations/:orgId/shops",
  authMiddleware,
  requireRole("admin"),
  getShopsByOrganisation
);

router.patch(
  "/shops/:shopId/status",
  authMiddleware,
  requireRole("admin"),
  toggleShopStatus
);
router.get(
  "/analytics/:organisationId",
  authMiddleware,
  requireRole("admin"),
  getOrganisationAnalytics
);
router.get(
  "/shops/:shopId/analytics",
  authMiddleware,
  requireRole("admin"),
  getShopAnalytics
);

router.get(
  "/shops/:shopId/orders",
  authMiddleware,
  requireRole("admin"),
  getShopOrders
);




export default router;
