const router = require('express').Router();
const {
  getAllUsers,
  createUser,
  deleteUser,
} = require('../../controllers/userController.js');


router.route('/').get(getAllUsers).post(createUser);

router
  .delete(deleteUser);

  
module.exports = router;
