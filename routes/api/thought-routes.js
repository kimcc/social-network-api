const router = require('express').Router();

// Destructure method names
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought
} = require('../../controllers/thought-controller');

// Set up all GET and POST routes at /api/users
router
  .route('/')
  .get(getAllThought)
  .post(createThought);

// Set up GET on, PUT, and DELETE routes at /api/users/:id
router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);
  
// Set up POST and DELETE for /api/thoughts/:thoughtId/reactions
router
  .route('/:thoughtId/reactions')
  .post(createThought)
  .delete(deleteThought)

module.exports = router;