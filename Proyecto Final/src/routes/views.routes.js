import ProductManager from "../dao/db/product-manager-db.js";
import CartManager from "../dao/db/cart-manager-db.js";
import { Router } from "express";
const router = Router();

//home.handlebars
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/products", async (req, res) => {
    try {
        const {page = 1, limit = 5 } = req.query;
        const productos = await productManager.obtenerProductos({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const nuevoArreglo = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("products", {
            productos: nuevoArreglo,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });
    } catch (error) {
        console.log("Error al obtener los productos desde la BD", error);
        res.status(500).json({status: 'error', error:'Error interno del servidor'});
    }
});

router.get("/carts/:cid", async (req, res) => {
    const cartID = req.params.cid;

    try {
        const carrito = await cartManager.obtenerCarritoxID(cartID);

        if (!carrito) {
            console.log("No existe el carrito");
            return res.status(404).json({error: "Carrito no encontrado"});
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));

        res.render("carts", {productos: productosEnCarrito});
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

export default router;