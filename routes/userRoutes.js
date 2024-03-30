const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/checkLoggedIn', authController.isLoggedIn, (req, res) => {

    const isLoggedIn = res.locals.user ? true : false;
    const userData = res.locals.user || null; 
    res.json({ isLoggedIn, userData });

});

router.get('')

router
    .route('/')
    .get(userController.getAllUsers)
    .get(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router