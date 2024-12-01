const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const {
  initiatePayment,
  handlePaymentCallback,
} = require("../controllers/paymentController");

// Payment CRUD routes
router.post("/", paymentController.createPayment); // Create a new payment
router.get("/", paymentController.getAllPayments); // Get all payments
router.get("/:id", paymentController.getPaymentById); // Get a specific payment by ID
router.put("/:id", paymentController.updatePayment); // Update a payment
router.delete("/:id", paymentController.deletePayment); // Delete a payment

router.post("/initialize-payment", paymentController.initializePayment);
router.post("/payment-callback", paymentController.handlePaymentCallback);

module.exports = router;
