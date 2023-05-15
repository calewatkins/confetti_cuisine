const Subscriber = require('../models/subscriber');
const user = require('../models/user');

let getSubscriberParams = (body) => {
  return {
      name: body.name,
      email: body.email,
      zipCode: body.zipCode
  };
};

module.exports = {
  index: (req, res, next) => {
    Subscriber.find()
      .then(subscriber => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("subscribers/index");
  },
  new: (req, res) => {
    res.render("subscribers/new");
  },
  create: (req, res, next) => {
    let subscriberParams = getSubscriberParams(req.body);
    Subscriber.create(subscriberParams)
      .then(subscriber => {
        req.flash("sucess", `${subscriber.name} subscriber account created successfully!`);
        res.locals.redirect = "/subscribers";
        res.locals.subscriber = subscriber;
        next();
      })
      .catch(error => {
        req.flash("error", `Failed to create subscriber account because: ${error.message}`);
        res.locals.redirect = "/subscribers/new";
        //console.log(`Error saving subscriber: ${error.message}`);
        next();
      });
  },
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.render("subscribers/edit", {
          subscriber: subscriber
        });
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      })
  },
  //update
  update: (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = getSubscriberParams(req.body);
    Subscriber.findByIdAndUpdate(subscriberId, {
      $set: subscriberParams
    })
      .then(subscriber => {
        req.flash("success", `${subscriber.name} subscriber account updated successfully!`);
        res.locals.redirect = `/subscribers/${subscriberId}`;
        res.locals.subscriber = subscriber;
        next();
      })
      .catch(error => {
        req.flash("error", `Failed to update account because: ${error.message}`);
        next();
      });
  },
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        req.flash("success", "Account deleted successfully");
        res.locals.redirect = "/subscribers";
        next();
      })
      .catch(error => {
        req.flash("error", "Failed to delete account.");
        console.log(`Error deleteing subscriber by id: ${error.message}`);
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
    .then(subscriber => {
      res.locals.subscriber = subscriber;
      next();
    })
    .catch(error => {
      console.log(`Error fetching susbscriber by ID: ${error.message}`);
      next(error);
    });
  },
  showView: (req, res) => {
    res.render("subscribers/show");
  }
};
