const router = require('express').Router();

// Destructure method names
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thought-controller');

// Set up all GET and POST routes at /api/thoughts
router
  .route('/')
  .get(getAllThought)
  .post(createThought);

// Set up GET on, PUT, and DELETE routes at /api/thoughts/:id
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);
  
// Set up POST and DELETE for /api/thoughts/:thoughtId/reactions
router
  .route('/:thoughtId/reactions')
  .post(createReaction)
  .delete(deleteReaction)

module.exports = router;