// var express = require('express');
// const User = require('../models/User');
// const auth = require('../middleware/auth');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/', auth, async (req, res) => {
//   try {
//       const users = await User.find({ _id: { $ne: req.user._id } }); // Exclude current user
//       res.json(users);
//   } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ message: 'Server error' });
//   }
// });

// // Define the getAllUsers function directly in this file
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({ _id: { $ne: req.user._id } }, 'name avatar'); // Exclude current user
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// router.get('/all', auth, getAllUsers);

// module.exports = router;

var express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
var router = express.Router();
const userController = require('../controllers/userController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/', auth, async (req, res) => {
//   try {
//       const users = await User.find({ _id: { $ne: req.user._id } }); // Exclude current user
//       res.json(users);
//   } catch (error) {
//       console.error('Error fetching users:', error);
//       res.status(500).json({ message: 'Server error' });
//   }
// });


// Get all users
router.get("/all", userController.getAllUsers);

// Get a single user by ID
router.get("/:id", userController.getUserById);

// Optional: search users
router.get("/search/:query", userController.searchUsers);



module.exports = router;

