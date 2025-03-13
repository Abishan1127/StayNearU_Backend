const express = require("express");
const { registerUser, loginUser, logoutUser, verifyUser, getAllUsers, updateUserById, getUserById, deleteUserById } = require("../controllers/userController");

const router = express.Router();

// Get All Users
router.get("/", getAllUsers);
// update user by id
router.put("/:id", updateUserById);
// get user by id
router.get("/:id", getUserById);
// delete user by id
router.delete("/:id", deleteUserById);


//  Register User
router.post("/register", registerUser);

//  Login User
router.post("/login", loginUser);

//  Logout User
router.post("/logout", logoutUser);

//  Verify Authentication
router.get("/verify", verifyUser);

module.exports = router;
