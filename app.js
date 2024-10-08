import express from 'express';
import bodyParser from 'body-parser';

let app = express();

import indexRoutes from './routes/index.js';
app.use(indexRoutes);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

const port = process.env.PORT || 8080;
export default app.listen(port, function () {
  console.log('listening at ' + port);
});
