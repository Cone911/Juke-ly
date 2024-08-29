const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')

// All paths start with "/auth"

// GET /auth/sign-up (show sign-up form)
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

// POST /auth/sign-up (create user)
router.post('/sign-up', async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password & confirmation do not match');
    }
    req.body.password = bcrypt.hashSync(req.body.password, 6);
    const user = await User.create(req.body);
    req.session.user = { _id: user._id };
    req.session.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/songs');
});

// POST /auth/login (login user)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
      return res.redirect('/auth/login');
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = { _id: user._id };
      req.session.save();
      return res.redirect('/songs');
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

router.get('/login', async (req, res) => {
  res.render('auth/login.ejs');
});

// GET /auth/logout (logout)
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/songs');
});

module.exports = router;