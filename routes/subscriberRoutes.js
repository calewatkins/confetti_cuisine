const router = require('express').Router();
const subscriberController = require('../controllers/subscribersController');

router.get("/", subscriberController.index, subscriberController.indexView);
router.get("/new", subscriberController.new);
router.get("/:id", subscriberController.show, subscriberController.showView);
router.get("/:id/edit", subscriberController.edit);
router.post("/create", subscriberController.create, subscriberController.redirectView);
router.put("/:id/update", subscriberController.update, subscriberController.redirectView);
router.delete("/:id/delete", subscriberController.delete, subscriberController.redirectView);

module.exports = router;