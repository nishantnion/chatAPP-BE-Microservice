const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  members: [
    {
      type: String, 
      required: true,
    },
  ],
  profilePicture: String, 
 
  createdBy: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
