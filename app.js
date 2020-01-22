const express = require('express');
const morgan = require('morgan');
const apps = require('./appList.js');

const app = express();

app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  
  const { sort = '', genres = '' } = req.query;  
  let results = apps;

  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating or app, you terrible person');
    }
  }

  if (genres) {
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('Allowed genres: Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  if (genres) results = apps
    .filter(app => 
      app
        .Genres === genres);

  if (sort) {
    results
      .sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
  }
      

  res.json(results);
});



app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});