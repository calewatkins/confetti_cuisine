const Course = require('../models/course');
const httpStatus = require('http-status-codes');
const User = require('../models/user');

let getCourseParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    maxStudents: body.maxStudents,
    cost: body.cost
  };
};

module.exports = {
  index: (req, res, next) => {
    Course.find()
    .then(courses => {
      res.locals.courses = courses;
      next();
    })
    .catch(error => {
      console.log(`Error fetching courses: ${error.message}`);
      next(error);
    });
  },
  indexView: (req, res) => {
    res.render("courses/index");
  },
  new: (req, res) => {
    res.render("courses/new");
  },
  create: (req, res, next) => {
    let courseParams = getCourseParams(req.body);
    Course.create(courseParams)
      .then(course => {
        req.flash("success", `${course.title} created successfully!`);
        res.locals.redirect = "/courses";
        res.locals.course =  course;
        next();
      })
      .catch(error => {
        req.flash("error", `Error creating course because: ${error.message}`);
        res.locals.redirect = "/courses/new";
        next();
      });
  },
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      })
  },
  update: (req, res, next) => {
    let courseId = req.params.id;
    let  courseParams = getCourseParams(req.body);
    Course.findByIdAndUpdate(courseId, {
      $set: courseParams
    })
      .then(course => {
        req.flash("success", `${course.title} updated successfully!`);
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch(error => {
        req.flash("error", `failed to update course because: ${error.message}`);
        next();
      });
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        req.flash("success", "Course deleted successfully!");
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        req.flash("error", `Failed to delete course because: ${error.message}`);
        next();
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by Id: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("courses/show");
  },
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.StatusCodes.OK,
      data: res.locals
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message
      };
    } else {
      errorObject = {
        status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Unknown Error."
      };
    }
    res.json(errorObject);
  },
  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId
        }
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch(error => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },
  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (currentUser) {
      let mappedCourses = res.locals.courses.map(course => {
        let userJoined = currentUser.courses.some(userCourse => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  }
};