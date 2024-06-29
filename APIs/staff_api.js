const express = require("express");
const router = express.Router();
const userModel = require("../model/staff");
const app = express();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { code, username, username_en, image_url, role } = req.body;
    // Create a new user if no duplicates found
    const user = new userModel({ code, username, username_en, image_url, role });
    await user.save();
    res.json({ message: 'Staff registered successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User registration
router.get("/list", async (req, res) => {
  try {
    userModel
      .find({ isActive: true })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      // .limit(40) // Limit the results to 15 records
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            res.json({
              status: false,
              message: "find list staff user fail",
              totalResult: null,
              data: data,
            });
          } else {
            res.json({
              status: true,
              message: "find list staff user success",
              totalResult: data.length,
              data: data,
            });
          }
        }
      });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});


// User registration
router.get("/list/paging", async (req, res) => {
    try {
      const { start = 0, limit = 10 } = req.query;
      
      console.log(`Fetching data with start: ${start} and limit: ${limit}`);
      
      const data = await userModel
          .find({})
          .sort({ createAt: -1 }) // Sort by updateAt in descending order
          .skip(parseInt(start)) // Skip records based on the 'start' parameter
          .limit(parseInt(limit)) // Limit the results to the 'limit' parameter
          .exec();
      if (data.length === 0) {
        return res.status(200).json({
          status: false,
          message: "find list staff  fail",
          totalResult: null,
          data: data,
        });
      } else {
          return res.json({
            status: true,
            message: "find staff  success",
            totalResult: data.length,
            data: data,
          });
          
      }
  } catch (error) {
      console.error("Error occurred while fetching data:", error);
      res.status(500).json({ status: false, message: "An error occurred" });
  }
});




const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// User registration
router.get("/list_shuffle", async (req, res) => {
  try {
    userModel
      .find({ isActive: true })
      .exec(function (err, data) {
        if (err) {
          console.log(err);
          res.status(500).send({ status: false, message: "An error occurred" });
        } else {
          if (data == null || data.length == 0) {
            res.json({
              status: false,
              message: "find list staff user fail",
              totalResult: null,
              data: data,
            });
          } else {
            // Shuffle the data array
            const shuffledData = shuffleArray(data);
            res.json({
              status: true,
              message: "find list staff user success",
              totalResult: shuffledData.length,
              data: shuffledData,
            });
          }
        }
      });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


// Update staff by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, username, username_en, image_url, role,isActive } = req.body;
    const updateFields = {};
    if (code !== undefined) updateFields.code = code;
    if (username !== undefined) updateFields.username = username;
    if (username_en !== undefined) updateFields.username_en = username_en;
    if (image_url !== undefined) updateFields.image_url = image_url;
    if (role !== undefined) updateFields.role = role;
    if (isActive !== undefined) updateFields.isActive = isActive;
    const updatedStaff = await userModel.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Staff updated successfully', data: updatedStaff });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Update failed' });
  }
});

// Update staff image_url by ID
router.put('/update_image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;
    if (!image_url) {
      return res.status(400).json({ message: 'image_url is required' });
    }
    const updatedStaff = await userModel.findByIdAndUpdate(
      id,
      { image_url },
      { new: true }
    );
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Staff image_url updated successfully', data: updatedStaff });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Update failed' });
  }
});


// User delete by _id
router.delete("/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // Check if the user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Staff  not found" });
    }
    // Delete the user
    await existingUser.remove();
    res.status(200).json({ status: true, message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete staff failed" });
  }
});

module.exports = router;
