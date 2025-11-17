const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploader = multer({dest: "./public/gallery/news/"});


const {
	uudisedHomePage,
	uudisedAll,
	uudisedAdd,
	uudisedAddPost,

} = require("../controllers/uudisedControllers");

router.route("/").get(uudisedHomePage);
router.route("/uudised_all").get(uudisedAll);
router.route("/uudised_add").get(uudisedAdd);
router.route("/uudised_add").post(uploader.single("photoInput"), uudisedAddPost);

module.exports = router;