const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email'],
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
},
{
  toJSON: { 
    virtuals: true
  },
  id: false // Set id to false because this is a virtual that Mongoose returns and we don't need it
}
);


// Virtual called friendCount that retrieves the length of the user's friends array field on query
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// https://github.com/Automattic/mongoose/issues/1241
UserSchema.pre('remove', function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want to be notified of the calls' result.
  Thought.remove({userId: this._id}).exec();
  next();
});

const User = model('User', UserSchema);

module.exports = User;
