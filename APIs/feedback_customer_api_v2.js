const express = require("express");
const router = express.Router();
const feedbackCustomerModel = require("../model/feedback_customer_v2");
const app = express();
const fs = require("fs");
const functions = require("../functions");

// feedback item registration
router.post("/create", async (req, res) => {
  try {
    const {
      statusName,
      customerNumber,
      customerName,
      customerCode,
      customerNatinality,
      note,
      hasNote,
      service_good,
      service_bad,
      staffNameEn,
      staffName,
      staffCode,
      staffRole,
      tag,
    } = req.body;
    const newFeedbackItem = new feedbackCustomerModel({
      statusName,
      customerNumber,
      customerName,
      customerCode,
      customerNatinality,
      note,
      hasNote,
      service_good,
      service_bad,
      staffNameEn,
      staffName,
      staffCode,
      staffRole,
      tag,
    });
    const savedItem = await newFeedbackItem.save();
    res.status(201).json({
      status: true,
      message: "Feedback customer  created successfully",
      data: savedItem,
    });
  } catch (error) {
    console.error("Error creating feedback customer v2 item:", error);
    res.status(500).json({ status: false, message: "Internal server error", data: null });
  }
});

//list item
router.get("/list", async (req, res) => {
  try {
    feedbackCustomerModel
      .find({})
      .sort({ updateAt: -1 }) // Sort by createdAt in descending order
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            return res.status(200).json({
              status: false,
              message: "find list feedback customer v2 fail",
              totalResult: null,
              data: data,
            });
          } else {
            return res.json({
              status: true,
              message: "find feedback customer v2  success",
              totalResult: data.length,
              data: data,
            });
          }
        }
      });
  } catch (error) {
    res.status(500).json({ error: "get list checklist failed" });
  }
});


router.get("/list/paging", async (req, res) => {
  try {
      const { start = 0, limit = 10 } = req.query;
      
      console.log(`Fetching data with start: ${start} and limit: ${limit}`);
      
      const data = await feedbackCustomerModel
          .find({})
          .sort({ updateAt: -1 }) // Sort by updateAt in descending order
          .skip(parseInt(start)) // Skip records based on the 'start' parameter
          .limit(parseInt(limit)) // Limit the results to the 'limit' parameter
          .exec();

      // console.log('Sorted Data:', data);

      if (data.length === 0) {
        return res.status(200).json({
          status: false,
          message: "find list feedback customer v2 fail",
          totalResult: null,
          data: data,
        });
      } else {
          return res.json({
            status: true,
            message: "find feedback customer v2  success",
            totalResult: data.length,
            data: data,
          });
          
      }
  } catch (error) {
      console.error("Error occurred while fetching data:", error);
      res.status(500).json({ status: false, message: "An error occurred" });
  }
});

module.exports = router;
