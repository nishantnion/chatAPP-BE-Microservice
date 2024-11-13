const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getAllUsers);
router.get("/:userId", userController.getUserProfile);
router.put("/:userId", userController.updateUserProfile);
router.delete("/:userId", userController.deleteUserProfile);
router.post("/profile/:userId", userController.uploadProfilePicture);


module.exports = router;
