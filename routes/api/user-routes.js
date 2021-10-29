const router = require('express').Router();

// Destructure method names
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../../controllers/user-controller');

// Set up all GET and POST routes at /api/users
router
  .route('/')
  .get(getAllUser)
  .post(createUser);

// Set up GET on, PUT, and DELETE routes at /api/users/:id
router
  .route('/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Set up POST and DELETE for /api/users/:userId/friends/:friendId
router
  .route('/:userId/friends/:friendId')
  .post(createUser)
  .delete(deleteUser)

module.exports = router;
  