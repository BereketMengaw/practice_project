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

exports.handlePaymentCallback = async (req, res) => {
  const { tx_ref, status } = req.body;

  try {
    const payment = await Payment.findOne({ where: { tx_ref: tx_ref } });
    if (!payment)
      return res.status(404).json({ error: "Payment record not found" });

    payment.status = status === "success" ? "completed" : "failed";
    await payment.save();

    if (payment.status === "completed") {
      await Enrollment.create({
        studentId: payment.userId,
        courseId: payment.courseId,
      });

      const course = await Course.findByPk(payment.courseId);

      const earning = await Earning.findOne({
        where: { courseId: payment.courseId },
      });
      if (earning) {
        earning.totalEarnings += payment.amount;
        await earning.save();
      } else {
        await Earning.create({
          creatorId: course.creatorId,
          courseId: payment.courseId,
          totalEarnings: payment.amount,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });
      }
    }

    res.status(200).json({ message: "Payment processed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error processing payment", details: error.message });
  }
};
