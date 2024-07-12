import express from 'express';
import exphbs from "express-handlebars";
import "./database.js";

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.listen(port, () => {
  console.log(`Escuchando Servidor en http://localhost:${port}`);
})

app.get('/', (req, res) => {
  res.send("<br> Proyecto Final-Gabriel Núñez <br>")
});



