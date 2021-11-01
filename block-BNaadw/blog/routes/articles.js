var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Comment = require('../models/comment');

/* GET users listing. */

//render a new article form
router.get('/new', (req, res, next) => {

  res.render('createArticleForm');


});

//render article home page
router.get('/home',(req,res)=>{
  let error=req.flash('error')[0];
  res.render('home',{error});
})


//render all articles list
router.get('/', (req, res, next) => {

  Article.find({}, (err, data) => {

    if (err) return next(err);
    res.render('articleList', { articles: data });
  })


})

// router.get('/:id',(req,res,next)=>{
//   const id=req.params.id;
//   Article.findById(id,(err,data)=>{
//     res.render('articleDetails',{article:data});
//   })


// })

//render the article with comments
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    console.log(article, id);
    Comment.find({ articleId: id }, (err, data) => {
      if (err) return next(err);
      console.log(data);
      res.render('articleDetails', ({ article: article, comments: data }))
    })
  })


})

//update the article
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, data) => {
    if (err) return next(err);
    res.render('updateArticleForm', { article: data });
  })

})


//create the article
router.post('/', (req, res, next) => {
  console.log(req.body, req.body.tags);
  req.body.tags = req.body.tags.split(' ');
  console.log(req.body, req.body.tags);
  Article.create(req.body, (err, data) => {
    if (err) return next(err);
    res.redirect('/articles');
  })
})



//update the article
router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Article.findByIdAndUpdate(id, req.body, (err, data) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  })

})




//delete the article

router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndDelete(id, (err, data) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: id }, (err, data) => {
      res.redirect('/articles');
    })

  })

})

//increment likes in article
router.get('/:id/inclikes', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, data) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  })

})


//decrement likes in article
router.get('/:id/declikes', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, data) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  })

})

//create the comment in article
router.post('/:id/comments', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, data) => {
    if (err) return next(err);
    console.log(req.body);
    req.body.articleId = id;
    Comment.create(req.body, (err, comment) => {
      if (err) return next(err);
      res.redirect('/articles/' + id);

    })

  })

})


module.exports = router;
