const { User } = require('../models');

const userController = {
  // get all Users
  getAllUser(req, res) {
    User.find({})
      .populate({ // Populate with the thoughts info
        path: 'thoughts',
        select: '-__v' 
      })
      .populate({ // Populate with the friends info
        path: 'friends',
        select: '-__v' 
      })
      .select('-__v')
      .sort({ _id: -1 }) // Sort by DESC order by the _id value
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
    .populate({
      path: 'friends',
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

  // Create user
  createUser({ body }, res) { 
    User.create(body) 
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // Find one document we want to update, update it, and return the updated document
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId }, 
      body, 
      { new: true, runValidators: true }
    ) 
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
  },

  // Create friend
  createFriend({ params }, res) {     
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } }, 
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No friend found with this id!'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  // Delete friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No friend found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = userController;