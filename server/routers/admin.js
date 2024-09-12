const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth')
const jwtSecret = process.env.JWTSECRET;
const Post = require('../models/post');
const methodOverride = require('method-override');
router.get('/', (req, res) => {
    res.render('admin/index');
})
router.get('/login', (req, res) => {
    res.render('admin/login')
})

// ===============================================
// ==================== SEt LAYOUT ===============
// -----------------------------------------------
router.use((req, res, next) => {
    res.locals.layout = '../views/layouts/admin'
    next();
})
// ---------------------------------------
// =============== REGISTER ==============
// ---------------------------------------
router.get('/register', (req, res) => {
    res.render('admin/register')
})

router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (user) {
        res.send("Email already exists")
    }
    else {
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.redirect('/admin');
        console.log(newUser);
    }
}))
// ==============================================
// --------------- LOGIN ------------------------
// ==============================================
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        const token = jwt.sign({ id: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/dashboard')
        console.log(user);
    } else {
        res.send('Invalid Email or Password');
    }
}))
// ==============================================
// ==============================================
router.get('/dashboard', auth, asyncHandler(async (req, res) => {
    const posts = await Post.find();
    const title = "Dashboard"
    res.render('admin/dashboard', ({
        posts,
        title
    }))
}))
// ================= ADD POST =================
router.get('/add', (req, res) => {
    res.render('admin/add')
})
router.post('/add', asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    await Post.create({ title, body })
    res.redirect('/admin/dashboard')
}))
// ----------------- EDIT POST -----------------
router.get('/edit/:id', asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('admin/edit', { post })
}))
router.post('/edit/:id', asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.send('Post not found')
    } else {
        await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.redirect('/admin/dashboard')
    }
}))
//----------------- delete post -------------------

router.get('/delete/:id', asyncHandler(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard')
}))

module.exports = router;