const User = require("../models/user");
const {upload} = require('../../../../middlewares/upload');

//=============================>>>>>>>>> GET USER PROFILE <<<<<<<<<<=====================================


exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Remove sensitive information from the response
    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      Bio: user.bio,
      profilePicture: user.profilePicture,
      name: user.name,
      createdAt: user.createdAt,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile." });
  }
};


//=============================>>>>>>>>> GET USER PROFILE <<<<<<<<<<=====================================


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -tokens -__v'); 
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch users" });
    console.log(error);
  }
};



//=============================>>>>>>>>> UPDATE USER PROFILE <<<<<<<<<<=====================================


exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;
   
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update the name, email, bio, and profile picture fields
    user.name = updates.name || user.name;
    user.email = updates.email || user.email;
    user.bio = updates.bio || user.bio;
    user.profilePicture = updates.profilePicture || user.profilePicture;
    user.name = updates.name || user.name;

    await user.save();
    
    // Remove sensitive information from the response
    const updatedProfile = new User({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Error updating user profile." });
  }
};


//=============================>>>>>>>>> DELETE USER PROFILE <<<<<<<<<<=====================================



exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User profile deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user profile." });
  }
};


//=============================>>>>>>>>> UPDATE USER PROFILE PICTURE <<<<<<<<<<=====================================


const singleProfilePictureUpload = upload.single('profilePicture');

exports.uploadProfilePicture = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Upload the profile picture
    singleProfilePictureUpload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading profile picture:', err);
        return res.status(500).json({ error: 'Error uploading profile picture' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
     
      // Update the profile picture field in the user document
      user.profilePicture = req.file.location;
      await user.save();

      res.status(200).json({ message: 'Profile picture uploaded successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile picture.' });
  }
};
