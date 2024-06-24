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
      .limit(40) // Limit the results to 15 records
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
      .limit(40) // Limit the results to 40 records
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


//UPDATE user by _id
router.put("/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, username_en, image_url, is_active } = req.body;
    // Check if the user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user fields
    existingUser.username = username || existingUser.username;
    existingUser.username_en = username_en || existingUser.username_en;
    existingUser.image_url = image_url || existingUser.image_url;
    existingUser.isActive = is_active || existingUser.isActive;
    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }
    // Save the updated user
    await existingUser.save();
    res
      .status(200)
      .json({ status: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
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
    res
      .status(200)
      .json({ status: true, message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete staff failed" });
  }
});

module.exports = router;
