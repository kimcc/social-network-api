const { Thought, User } = require('../models');

const thoughtController = {
  // get all Thoughts
  getAllThought(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 }) // Sort by DESC order by the _id value. We can do this because there's a hidden timestamp value in the MongoDB ObjectId
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one Thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } }, // Use push to add the data to specific user we want to update. Push will add data to an array just like JavaScript. All MongoDB functions start with a a dollar sign to indicate that it's a built-in function
          { new: true, runValidators: true }
        );
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!'});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  // Find one document we want to update, update it, and return the updated document
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true }) // Set new to true so it won't return the original document. Tell Mongoose to return the new version of the document
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!'} );
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete Thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { comments: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Create reaction
  createReaction({ params }, res) {     
    Thought.findOneAndUpdate(
      { _id: params.userId },
      { $push: { thoughts: params.reactionId } }, 
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No reaction found with this id!'});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  // Delete reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndDelete(
      { _id: params.thoughtId },
      { $pull: { friends: params.reactionId } }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No reaction found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;