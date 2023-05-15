const mongoose = require('mongoose');
const Subscriber = require('./models/subscriber');

mongoose.connect(
  "mongodb://localhost:27017/confetti_cuisine_V2",
  { useNewUrlParser: true }
);

mongoose.connection;

var contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103
  },
  {
    name: "Cale Watkins",
    email: "cale@jonwexler",
    zipCode: 15205
  },
  {
    name: "Oscar the Cat",
    email: "oscar@jonwexler.com",
    zipCode: 15205
  }
];

Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });

var commands = [];

contacts.forEach((c) => {
  commands.push(Subscriber.create({
    name: c.name,
    email: c.email
  }));
});

Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });