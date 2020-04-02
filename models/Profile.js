const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    company: {
      type: String
    },
    website: {
      type: String
    },
    location: {
      type: String
    },
    status: {
      type: String,
      required: [true, 'status is required']
    },
    skills: {
      type: [String],
      required: [true, 'Skills are required']
    },
    bio: {
      type: String
    },
    githubUsername: {
      type: String
    },
    experience: [
      {
        title: {
          type: String,
          required: [true, 'Title is required']
        },
        company: {
          type: String,
          required: [true, 'Company is required']
        },
        location: {
          type: String,
          required: [true, 'Location is required']
        },
        from: {
          type: Date,
          required: [true, 'From Date is required']
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String
        }
      }
    ],
    education: [
      {
        school: {
          type: String,
          required: [true, 'School is required']
        },
        degree: {
          type: String,
          required: [true, 'Degree is required']
        },
        fieldOfStudy: {
          type: String,
          required: [true, 'Field of Study is required']
        },
        from: {
          type: Date,
          required: [true, 'From date is required']
        },
        to: {
          type: Date
        },
        current: {
          type: Boolean,
          default: false
        },
        description: {
          type: String
        }
      }
    ],
    social: {
      youtube: {
        type: String
      },
      twitter: {
        type: String
      },
      facebook: {
        type: String
      },
      linkedin: {
        type: String
      },
      instagram: {
        type: String
      }
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
