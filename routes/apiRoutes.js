const router = require('express').Router();
const courseController = require('../controllers/coursesController');
const usersController = require('../controllers/usersController');

router.post("/login", usersController.apiAuthenticate);

router.use(usersController.verifyJWT);

router.get("/courses/:id/join", courseController.join, courseController.respondJSON);
router.get("/courses", courseController.index, courseController.filterUserCourses, courseController.respondJSON);

router.use(courseController.errorJSON);

module.exports = router;