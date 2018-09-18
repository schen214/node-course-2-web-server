const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// port is used for Heroku since its port is always changing we need to access it through process.env.PORT
// process.env is an object that stores all our environment variables as key value pairs
const port = process.env.PORT || 3000;
var app = express();

// app.set takes two arguments, key you want to set, value is what you want to use.. eg: view engine we want to use is 'hbs'.
app.set('view engine', 'hbs');
// Calling next() is required to finish the middleware task otherwise the paths registered afterwards won't be available
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// express.static(): need to specify the absolute path of file you want to serve
// __dirname is an accessible variable that references the root absolute path, D://Documents/nodejs-udemy-Andrew/node-web-server
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to Express!'
  });
});

app.get('/about', (req, res) => {
  console.log(res);
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request!'
  })
});


// app.listen can take a second argument; a callbackfunction since it takes a little time to start up server
app.listen(port, () => {
  console.log(`Server is starting on port ${port}`);
});
