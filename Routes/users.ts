import express from "express";
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("respond with a resource");
});

export default router;
