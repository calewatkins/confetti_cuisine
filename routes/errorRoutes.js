const router = require('express').Router();
const errorController = require('../controllers/errorController');

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

module.exports = router;