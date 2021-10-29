const { User } = require('../models');

const userController = {
  // get all Users
  getAllUser(req, res) {
    User.find({})
      .populate({ // Use populate to populate the field with the comment info
        path: 'thoughts',
        select: '-__v' // Tell Mongoose that we don't care about the __v field on comments. We use the minus sign to indicate we don't want it returned
      })
      .select('-__v')
      .sort({ _id: -1 }) // Sort by DESC order by the _id value. We can do this because there's a hidden timestamp value in the MongoDB ObjectId
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  createUser({ body }, res) { // Destructure body out of the Express req object since that's the only part we need 
    User.create(body) // create will handle either inserting one or inserting many
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // Find one document we want to update, update it, and return the updated document
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true }) // Set new to true so it won't return the original document. Tell Mongoose to return the new version of the document
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!'} );
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete User
  // Use findOneAndRemove so that we can use user.remove and remove the thoughts as well
  deleteUser({ params }, res) {
    User.findOneAndRemove({ _id: params.userId }, function(err, user) {
      if (err) {
        res.status(404).json({ message: 'No user found with this id!'} );
        return;
      }
      res.json(user);
      user.remove();
    })
  }
};

module.exports = userController;