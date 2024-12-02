const Payment = require("../models/Payment");
const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Earning = require("../models/Earning");

const paymentService = require("../services/paymentService");

exports.createPayment = async (req, res) => {
  try {
    const { userId, courseId, amount, paymentMethod, status, tx_ref } =
      req.body;

    // Validate input
    if (!userId || !courseId || !amount || !paymentMethod || !status) {
      return res.status(400).json({
        error:
          "User ID, Course ID, Amount, Payment Method, and Status are required.",
      });
    }

    // Create the payment record
    const payment = await Payment.create({
      userId,
      courseId,
      amount,
      paymentMethod,
      status,
      tx_ref,
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).json({
      error: "Error creating payment",
      details: error.message,
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { userId, courseId, amount, paymentMethod, status } = req.body;

    // Check if required fields are provided
    if (!userId || !courseId || !amount || !paymentMethod || !status) {
      return res.status(400).json({
        error:
          "User ID, Course ID, Amount, Payment Method, and Status are required.",
      });
    }

    const updated = await Payment.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated[0]) {
      const updatedPayment = await Payment.findByPk(req.params.id);
      res.status(200).json(updatedPayment);
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.initializePayment = async (req, res) => {
  const { username, courseTitle } = req.body;

  try {
    const user = await User.findOne({ where: { name: username } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const course = await Course.findOne({ where: { title: courseTitle } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    //for the transaction id
    const tx_ref = `tx_${Date.now()}`;

    const payment = await Payment.create({
      userId: user.id,
      courseId: course.id,
      amount: course.price,
      paymentMethod: "Chapa",
      status: "pending",
      tx_ref: tx_ref,
    });

    const paymentResponse = await paymentService.initiatePayment(
      payment,
      tx_ref
    );
    res.status(200).json(paymentResponse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error initializing payment", details: error.message });
  }
};

// controllers/paymentController.js

exports.handlePaymentCallback = async (req, res) => {
  const { tx_ref, status } = req.body; // Get transaction reference and status from Chapa's callback

  // Webhook Security: Verify the authenticity of the webhook (assuming Chapa provides a secret key)
  const chapaSignature = req.headers["x-chapa-signature"];
  const secret = process.env.CHAPA_WEBHOOK_SECRET; // Store your secret securely in environment variables

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  if (chapaSignature !== expectedSignature) {
    return res.status(403).json({ error: "Invalid webhook signature" });
  }

  // Validate the incoming payload
  if (!tx_ref || !status) {
    return res
      .status(400)
      .json({ error: "Invalid payload: tx_ref and status are required." });
  }

  const t = await sequelize.transaction(); // Start a transaction to ensure atomicity
  try {
    // Find the payment record in the database using the tx_ref
    const payment = await Payment.findOne({
      where: { tx_ref },
      transaction: t,
    });
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Update the payment status based on Chapa's status
    payment.status = status === "success" ? "completed" : "failed";
    await payment.save({ transaction: t });

    // If the payment was successful, enroll the user and update earnings
    if (payment.status === "completed") {
      // Enroll the user in the course
      await Enrollment.create(
        {
          userId: payment.userId,
          courseId: payment.courseId,
        },
        { transaction: t }
      );

      // Get course details to update earnings
      const course = await Course.findByPk(payment.courseId, {
        transaction: t,
      });

      // Check if earnings record exists for the course
      const earning = await Earning.findOne({
        where: { courseId: payment.courseId },
        transaction: t,
      });
      if (earning) {
        // Update the earnings if the record exists
        earning.totalEarnings += payment.amount;
        await earning.save({ transaction: t });
      } else {
        // Create a new earnings record if it doesn't exist
        await Earning.create(
          {
            creatorId: course.creatorId,
            courseId: payment.courseId,
            totalEarnings: payment.amount,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
          { transaction: t }
        );
      }
    }

    // Commit the transaction
    await t.commit();

    // Respond with a success message
    res.status(200).json({ message: "Payment processed successfully" });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await t.rollback();
    console.error("Error processing payment:", error);
    res
      .status(500)
      .json({ error: "Error processing payment", details: error.message });
  }
};
