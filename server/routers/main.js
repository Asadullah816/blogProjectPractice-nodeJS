const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Post = require('../models/post');
const { isActiveRoute } = require('../helpers/routeHelpers')


// ==================================================================================================
// ==================================================================================================
// All Posts
router.get('/', asyncHandler(async (req, res) => {
    // const posts = await Post.find();
    let perPage = 6;
    let page = req.query.page || 1;
    const user = await User.findById(req.userId);
    const posts = await Post.aggregate([{ $sort: { createdat: -1 } }])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    res.render('index', {
        posts, current: page, nextPage: hasNextPage ? nextPage : null, user, currentRoute: '/'
    })
}))

// ==================================================================================================
// ==================================================================================================
//  Single Post
router.get('/blog/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);
    const post = await Post.findById(req.params.id);
    res.render('blog', { post, user });
}))

// ==================================================================================================
// ==================================================================================================
// Search Post
router.post('/search', asyncHandler(async (req, res) => {
    let searchTerm = req.body.search;
    const user = await User.findById(req.userId);
    console.log(searchTerm)
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Post.find({
        $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
        ]
    })
    res.render('search', { data, user });
}))
router.get('/about', (req, res) => {
    res.render('about', { currentRoute: '/about' });
})
module.exports = router;














































































// function insertPost() {
//     Post.insertMany([
//         {
//             "title": "Introduction",
//             "body": "This is the introductory section, outlining the main topics."
//         },
//         {
//             "title": "Chapter 1: Basics",
//             "body": "This chapter covers the basic principles and foundational knowledge."
//         },
//         {
//             "title": "Chapter 2: Advanced Concepts",
//             "body": "In this chapter, we dive into more complex ideas and advanced techniques."
//         },
//         {
//             "title": "Chapter 3: Applications",
//             "body": "Here we explore practical applications of the concepts covered earlier."
//         },
//         {
//             "title": "Chapter 4: Case Studies",
//             "body": "This chapter provides real-world examples and case studies."
//         },
//         {
//             "title": "Chapter 5: Tools and Resources",
//             "body": "A compilation of tools, resources, and references for further exploration."
//         },
//         {
//             "title": "Conclusion",
//             "body": "Summarizing the key points and providing final thoughts."
//         },
//         {
//             "title": "Appendix A",
//             "body": "Additional information, charts, and supplementary content."
//         },
//         {
//             "title": "Appendix B",
//             "body": "More detailed explanations of specific topics covered in the text."
//         },
//         {
//             "title": "References",
//             "body": "A list of all references and sources used throughout the document."
//         }
//     ]
//     )
// }
// insertPost();