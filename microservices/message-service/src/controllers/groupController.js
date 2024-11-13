const Group = require('../models/group');
const Message = require('../models/message');
const {uploadGroupProfilePic} = require('../../../../middlewares/upload')


//=============================>>>>>>>>> TO CREATE A NEW GROUP <<<<<<<<<<=====================================


exports.createGroup = async (req, res) => {
  try {
    const { name, members , description } = req.body;
    const createdBy = req.params.id;
    members.push(createdBy)
    const newGroup = new Group({ name, members, description, createdBy });
    await newGroup.save();
    res.status(201).json({msg : 'Group created Successfully'});
  } catch (error) {
    console.error('Error creating group', error.message);
    res.status(500).json({ error: 'Error creating group' });
  }
};

  
//=============================>>>>>>>>> TO GET GROUP MESSAGES <<<<<<<<<<=====================================


  exports.getGroupMessages = async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const messages = await Message.find({ group: groupId }).populate('sender', 'username');
      res.status(200).json(messages); // Use "messages" instead of "message"
    } catch (error) {
      console.error('Error fetching group messages', error.message);
      res.status(500).json({ error: 'Error fetching group messages' });
    }
  };
  

//=============================>>>>>>>>> TO UPDATE GROUP NAME <<<<<<<<<<=====================================


  exports.updateGroup = async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const { name } = req.body;
  
      // Find the group by ID
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ error: 'Group not found.' });
      }
      group.name = name;
      await group.save();
  
      res.status(200).json(group);
    } catch (error) {
      console.error('Error updating group', error.message);
      res.status(500).json({ error: 'Error updating group' });
    }
  };


//=============================>>>>>>>>> TO UPDATE GROUP PROFILE PICTURE <<<<<<<<<<=====================================


const singleGroupProfilePictureUpload = uploadGroupProfilePic.single('profilePicture');
  
  exports.updateGroupProfilePicture = async (req, res) => {
    try {
      const groupId = req.params.groupId;
  
      // Find the group by ID
      const group = await Group.findById(groupId);
  
      if (!group) {
        return res.status(404).json({ error: 'Group not found.' });
      }
  
      // Upload the new group profile picture
      singleGroupProfilePictureUpload(req, res, async (err) => {
        if (err) {
          console.error('Error uploading group profile picture:', err);
          return res.status(500).json({ error: 'Error uploading group profile picture' });
        }

  
        if (req.file) {
        
          group.profilePicture = req.file.location;
        }
  
        // Save the updated group
        await group.save();
  
        res.status(200).json({ message: 'Group profile picture uploaded successfully' });
      });
    } catch (error) {
      console.error('Error updating group profile picture', error.message);
      res.status(500).json({ error: 'Error updating group profile picture' });
    }
  };



  //=============================>>>>>>>>> TO GET THE GROUPS OF A USER <<<<<<<<<<==================================



  exports.getGroupsForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find groups where the user is a member
      const groups = await Group.find({ members: userId });
  
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error fetching groups for user', error.message);
      res.status(500).json({ error: 'Error fetching groups for user' });
    }
  };