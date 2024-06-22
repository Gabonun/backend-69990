import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import displayRoutes from 'express-routemap';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(port, () => {
  console.log(`Escuchando Servidor en http://localhost:${port}`);
})

app.get('/', (req, res) => {
  res.send("<br> PreEntrega2-Gabriel Núñez <br>")
});


import ProductManager from './controllers/product_manager.js';
const productManager = new ProductManager("./src/data/products.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");

  socket.emit("productos", await productManager.obtenerProductos());

  //Recibimos "Eliminar cliente"
  socket.on("eliminarProducto", async (id) => {
    await productManager.eliminarProducto(id);
    io.sockets.emit("productos", await productManager.obtenerProductos());
  })

  //Para el formulario
  socket.on("agregarProducto", async (producto) => {
    await productManager.agregarProducto(producto);
    io.sockets.emit("productos", await productManager.obtenerProductos());
  })
})



