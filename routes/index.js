const router = require('express').Router();
const courseRoutes = require('./courseRoutes');
const userRoutes = require('./userRoutes');
const apiRoutes = require('./apiRoutes');

const subcriberRoutes = require('./subscriberRoutes'),
  homeRoutes = require('./homeRoutes');
  //errorRoutes = require('./errorRoutes'),

router.use("/users", userRoutes);
router.use("/subscribers", subcriberRoutes);
router.use("/courses", courseRoutes);
router.use("/api", apiRoutes);

router.use("/", homeRoutes);
//router.use("/", errorRoutes);

module.exports = router;