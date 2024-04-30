const express = require('express');
const router = express.Router();
const feedbackCustomerTtemsModel = require('../model/feedback_customer_item');
const feedbackCustomerModel = require('../model/feedback_customer');
const app = express();


// feedback item registration
router.post('/create', async (req, res) => {
  try {
    const { id, content,experience ,tag } = req.body;
    const newFeedbackItem = new feedbackCustomerModel({
        id,
        content,
        experience,
        tag,
    });
    const savedItem = await newFeedbackItem.save();
    res.status(201).json({ status: true, message: 'Feedback item created successfully', data: savedItem });
} catch (error) {
    console.error('Error creating feedback item:', error);
    res.status(500).json({ status: false, message: 'Internal server error',data:null });
}
});

//list item
router.get('/list', async (req, res) => {
  try {
    feedbackCustomerModel.find({})
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    // .limit(15) // Limit the results to 15 records
    .exec(function (err, data) {
      if (err) {
        console.log(err);
         res.status(500).send({ "status": false, "message": "An error occurred" });
      } else {
        if (data == null || data.length == 0) {
          return res.status(200).json({ "status": false, "message": "find list feedbackCustomerTtemsModel fail", "totalResult": null, "data": data });
        } else {
          return res.json({ "status": true, "message": "find feedbackCustomeModel  success", "totalResult": data.length, "data": data });
        }
      }
    });
    
} catch (error) {
res.status(500).json({ error: 'get list checklist failed' });
}
});
// feedback item list
router.get('/test', async (req, res) => {
  return res.json({ status: false, message: 'test', });
});



router.get('/list/paging', async (req, res) => {
  try {
      const { start = 0, limit = 10 } = req.query;
      feedbackCustomerModel.find({})
          .sort({ createdAt: -1 }) // Sort by createdAt in descending order
          .skip(parseInt(start))    // Skip records based on the 'start' parameter
          .limit(parseInt(limit))   // Limit the results to the 'limit' parameter
          .exec(function (err, data) {
              if (err) {
                  console.log(err);
                  res.status(500).send({ "status": false, "message": "An error occurred" });
              } else {
                  if (data == null || data.length == 0) {
                      res.status(200).json([]);
                  } else {
                      res.json( data );
                  }
              }
          });
  } catch (error) {
      res.status(500).json({ error: 'get list feedbackCustomerTtemsModel failed' });
  }
});


module.exports = router;