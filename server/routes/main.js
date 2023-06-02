import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// GET / HOME ROUTE
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created..."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        // const data = await Post.find();
        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null 
        });

    } catch (error) {
        console.log(error);
    }

});


// GET / POST : ID ROUTE
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple Blog created..."
        }


        res.render('post', { locals, data });
    } catch (error) {
        console.log(error);
    }
});


// POST / POST - searchTerm
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created..."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        });

        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/about', (req, res) => {
    res.render('about');
});

export default router;


/* function insertPostData() {
    Post.insertMany([
        {
            title: "First Blog",
            body: "Body text... "
        },
        {
            title: "Second Blog",
            body: "Body text... "
        },
    ])
}

insertPostData(); */