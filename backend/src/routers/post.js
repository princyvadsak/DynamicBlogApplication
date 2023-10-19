const express = require("express");

const auth = require("../middleware/auth");
const Post = require("../models/post");

const Comment = require("../models/comment");
const Like = require("../models/like");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 5120000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp4|mkv)$/)) {
      cb(new Error("only image, video and gif files allowed"));
    }
    cb(undefined, true);
  },
});

router.post("/addPost", auth, upload.single("media"), async (req, res) => {
  try {

    const post = new Post({
      ...req.body,
      owner: req.user._id,

    });

    await post
      .save()
      .then(() => {
        return res.send(post);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });

  } catch (e) {
    return res.send(e.message);
  }
});

//Edit post with topic id
router.patch("/editPost/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "topic"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid updates" });
    }

    const post = await Post.findOne({
      _id: req.params.id.trim(),
      owner: req.user._id,
    });
    if (!post) {
      return res.status(404).send("You can not edit this post");
    }
    updates.forEach(async (update) => {

      post[update] = req.body[update];

    });
    await post.save();
    return res.send(post);
  } catch (e) {
    return res.send(e.message);
  }
});

//delete post with postid
router.delete("/deletepost/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id.trim(),
      owner: req.user._id,
    });

    if (!post) {
      return res.status(404).send("You cannot delete this post");
    }
    return res.send(post);
  } catch (e) {
    return res.send(e.message);
  }
});



//get all login user post with populate and virtual fields
router.get("/me/posts", auth, async (req, res) => {
  try {
    await req.user.populate({
      path: "posts",
    });

    return res.send(req.user.posts);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

//get all users posts
router.get("/posts", auth, async (req, res) => {
  try {
    const post = await Post.find();
    if (!post) {
      return res.status(404).send();
    }
    return res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get login user post with purticular topic
router.get("/me/posts/:topic", auth, async (req, res) => {
  try {
    const post = await Post.find({
      owner: req.user._id,
      topic: req.params.topic.trim(),
    });
    if (!post) {
      return res.status(404).send();
    }
    return res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});


// get all users post with particular topic
router.get("/posts/:topic", auth, async (req, res) => {
  try {
    const post = await Post.find({
      topic: req.params.topic.trim(),
    });
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
}); 


// get recent post of login user
router.get("/me/recentposts", auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      owner: req.user._id,
    })
      .sort({ createdAt: -1 })
      .exec();
    if (!post) {
      return res.status(404).send();
    }
    return res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get recent post from all users
router.get("/recentposts", auth, async (req, res) => {
  try {
    const post = await Post.findOne().sort({ createdAt: -1 }).exec();
    if (!post) {
      return res.status(404).send();
    }
    return res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// add comment with post id
router.post("/comments/:post", auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.post.trim(),
    });
    if (post) {
      const comment = new Comment({
        ...req.body,
        by: req.user._id,
        post: req.params.post.trim(),
      });

      await comment
        .save()
        .then(async () => {
          const post = await Post.findOne({
            _id: comment.post,
          });

          post.comment += 1;
          await post
            .save()
            .then(() => {
              return res.send({ msg: "Thanks for comment", post });
            })
            .catch((e) => {
              return res.send(e.message);
            });
        })
        .catch((error) => {
          return res.status(400).send(error.message);
        });
    } else {
      return res.send(
        "This Post is not available so you cannnot add comment on this post"
      );
    }
  } catch (e) {
    return res.send(e.message);
  }
});

// delete comments with comment id
router.delete("/comments/:comment", auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.comment.trim(),
      by: req.user._id,
    });
    if (!comment) {
      return res.status(404).send("You cannot delete this comment");
    } else {
      const post = await Post.findOne({
        _id: comment.post,
      });
      if (post.comment > 0) {
        post.comment -= 1;
        await post
          .save()
          .then(() => {
            return res.send({ msg: "comment deleted", post: post });
          })
          .catch((e) => {
            return res.send(e.message);
          });
      }
    }
  } catch (e) {
    return res.send(e.message);
  }
});

//edit comment with comment id
router.patch("/comments/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["text"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "invalid updates" });
    }

    const comment = await Comment.findOne({
      _id: req.params.id.trim(),
      owner: req.user._id,
    });
    if (!comment) {
      return res.status(404).send("You can not edit this comment");
    }
    updates.forEach((update) => {
      comment[update] = req.body[update];
    });
    await comment.save();
    return res.send(comment);
  } catch (e) {
    return res.send(e.message);
  }
});

// Like post with id
router.post("/likes/:post", auth, async (req, res) => {
  try {
    const exist = await Like.findOne({
      by: req.user._id,
      post: req.params.post.trim(),
    });
    if (exist) {
      return res.send("alredy liked");
    } else {
      const like = new Like({
        by: req.user._id,
        post: req.params.post.trim(),
      });

      await like
        .save()
        .then(async () => {
          const post = await Post.findOne({
            _id: like.post,
          });
          post.like += 1;
          await post
            .save()
            .then(() => {
              return res.send({ msg: "Thanks for like", post });
            })
            .catch((e) => {
              return res.send(e.message);
            });
        })
        .catch((error) => {
          return res.status(400).send(error).message;
        });
    }
  } catch (e) {
    return res.send(e.message);
  }
});

//dislike post with id
router.delete("/dislikes/:post", auth, async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({
      by: req.user._id,
      post: req.params.post.trim(),
      like: true,
    });
    if (!like) {
      return res.status(404).send("alredy not liked");
    } else {
      const post = await Post.findOne({
        _id: like.post,
      });
      post.like -= 1;
      await post
        .save()
        .then(() => {
          return res.send({ msg: "ohh you dislike", post });
        })
        .catch((e) => {
          return res.send(e.message);
        });
    }
  } catch (e) {
    return res.send(e.message);
  }
});

// get most liked post from all users
router.get("/mostlikes", auth, async (req, res) => {
  try {
    const post = await Post.findOne().sort({ like: -1 }).exec();
    if (!post) {
      return res.status(404).send("No Post Available");
    }
    return res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get most like post of login user
router.get("/me/mostlikes", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ owner: req.user._id })
      .sort({ like: -1 })
      .exec();
    if (!post) {
      return res.status(404).send();
    }
    res.send(post);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
