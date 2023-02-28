const router = require("express").Router();
const Post = require("../models/Post");

//create a post

router.post("/", async (req, res) => {

  const desc = req.body.desc
  const username =  req.body.username
  const image = req.file.path

  const newPost = new Post({desc : desc, username : username, img : image});
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post 

router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/", async (req, res) => {
    try {
      const posts = await Post.find({});
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;