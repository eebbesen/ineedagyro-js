import express from 'express';
import indexRoutes from './routes/index.js';

const app = express();

app.use(indexRoutes);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

const port = process.env.PORT || 8080;
export default app.listen(port, () => {
  console.log(`listening at ${port}`);
});
