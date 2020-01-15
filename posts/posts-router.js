const express = require("express");

const Posts = require("../data/db.js"); // don't forget to import anything needed

const router = express.Router();

// a Router can have middleware
// a Router can have endpoints
// this router only cares about whatever comes after /

//! GET REQUEST -- HOME ===========================================================
router.get("/", (req, res) => {
  Posts.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});
//! GET REQUEST -- ALL POSTS =======================================================
router.get("/api/posts", (req, res) => {
  Posts.find(req.params)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "COULD NOT GET POSTS",
      });
    });
});
//! GET REQUEST -- POSTS BY ID =====================================================
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error retrieving the Post",
      });
    });
});
//! GET REQUEST -- GETS COMMENTS FROM A SPECIFIC ID ================================================
router.get("/:id/comments", (req, res) => {
  Posts.findCommentById(req.params.id)
    .then((comment) => {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the Comment",
      });
    });
});
//! POST REQUEST -- CREATES A NEW POST =========================================================
router.post("/", (req, res) => {
  const postData = req.body;
  const { title, contents } = postData;
  Posts.insert(postData)
    .then((p) => {
      console.log(p);
      if (title == "" || contents == "") {
        response.status(404).json({
          errorMessage: "Need to provide Title and Contents",
        });
      } else {
        res.status(201).json(p);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the Post",
      });
    });
});
//! POST REQUEST -- CREATES A NEW COMMENT ON A CERTAIN ID ==========================================
router.post("/:id/comments", (req, res) => {
  const commentData = req.body;
  const { text, post_id } = commentData;
  Posts.insertComment(commentData).then((com) => {
    if (!post_id) {
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist",
      });
    } else if (text == "") {
      res.status(400).json({
        errorMessage: "Please provide text for the comment.",
      });
    } else if (text && post_id) {
      res.status(201).json(com);
    } else {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the comment to the database",
      });
    }
  });
});
//! DELETE REQUEST ===================================================================
router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((id) => {
      if (id > 0) {
        res.status(200).json({ message: "The User has been nuked" });
      } else {
        res.status(404).json({ message: "The User could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error removing the User",
      });
    });
});
//! PUT REQUEST -- CAN EDIT A POST WITH A CHOSEN ID ==========================================
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatePost = req.body;
  const { title, contents } = updatePost;
  Posts.update(id, updatePost).then((post) => {
    if (!id) {
      res.status(404).json({
        errorMessage: "The Post with that Id does not exist",
      });
    } else if (title == "" || contents == "") {
      res.status(400).json({
        errorMessage: "Need to provide the title and content for the post",
      });
    } else if (post) {
      res.status(200).json({
        message: "Post info was updated successfully",
      });
    } else {
      res.status(500).json({
        errorMessage: "The post information could not be modified.",
      });
    }
  });
});
//! ==========================================================================================

module.exports = router;

// create file for the Router
// write code to create a router: require('express').Router();
// export it
// require and use the router on server.js: server.use('/api/hubs', hubsRouter)
