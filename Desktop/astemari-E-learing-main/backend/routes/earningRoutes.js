const express = require("express");
const router = express.Router();
const earningController = require("../controllers/earningController");

// CRUD routes for Earning
router.post("/", earningController.createEarning);
router.get("/", earningController.getAllEarnings);
router.get("/:id", earningController.getEarningById);
router.put("/:id", earningController.updateEarning);
router.delete("/:id", earningController.deleteEarning);

module.exports = router;
