const express = require("express");
const router = express.Router();

const {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost,
	eestifilmAdd,
	eestifilmAddPost,
	seosedAdd,
	seosedAddPost
} = require("../controllers/eestifilmControllers");

router.route("/").get(filmHomePage);
router.route("/filmiinimesed").get(filmPeople);
router.route("/filmiinimesed_add").get(filmPeopleAdd);
router.route("/filmiinimesed_add").post(filmPeopleAddPost);
router.route("/ametinimetused").get(filmPosition);
router.route("/ametinimetused_add").get(filmPositionAdd);
router.route("/ametinimetused_add").post(filmPositionAddPost);
router.route("/eestifilm_add").get(eestifilmAdd);
router.route("/eestifilm_add").post(eestifilmAddPost)
router.route("/seosed").get(seosedAdd)
router.route("/seosed").post(seosedAddPost)

module.exports = router;