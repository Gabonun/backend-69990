import CartModel from "../../models/cart.model.js"
import ProductModel from "../../models/product.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el nuevo carrito");
        }
    }

    async obtenerCarritoxID(cartID) {
        try {
            const carrito = await CartModel.findById(cartID);

            if (!carrito) {
                console.log("No existe el carrito");
                return null;
            }

            return carrito;
        } catch (error) {
            console.log("Erorr al obtener el carrito", error);
        }
    }

    async obtenerCarritos() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.error("Error al listar los carritos existentes");
        }
    }

    async agregarProductoCarrito(cartID, productID, quantity = 1) {
        try {
            const carrito = await this.obtenerCarritoxID(cartID);
            const existeProducto = carrito.products.find(item => item.product.toString() === productID);

            if (existeProducto){
                existeProducto.quantity += quantity;
            }else{
                carrito.products.push({product: productID, quantity});
            }

            //marcamos como modificado
            carrito.markModified("productos");

            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al agregar un producto al carrito", error);
        }
    }

    async vaciarCarrito(cartID){
        try {
            const cart = await this.obtenerCarritoxID(cartID);

            if (!cart){
                console.log("Carrito no encontrado")
            }

            cart.products = [];
            await cart.save()
            return cart;
        } catch (error) {
            console.log("Error al vaciar el carrito");
        }
    }

    async actualizarCarrito(cartID, productoUPD) {
        try {
            const cart = await this.obtenerCarritoxID(cartID);

            if (!cart){
                console.log("Carrito no encontrado")
            }

            cart.products = productoUPD;
            cart.markModified("products");
            await cart.save()
            return cart;
        } catch (error) {
            console.log("Error al actualizar el carrito");
        }
    }

    async actualizarCantidadProductoCarrito(cartID, productID, nuevaCantidad) {
        try {
            const cart = await this.obtenerCarritoxID(cartID);

            if (!cart){
                console.log("Carrito no encontrado")
            }

            const indice = cart.products.items.findIndex((item) => item.product._id.toString() === productID);

            if (indice !== -1) {
                cart.products[indice].quantity = nuevaCantidad
                cart.markModified("products");
                await cart.save();
                return cart;
            } else {
                console.log("Producto no encontrado en el carrito");
            }
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto");
        }
    }

    async eliminarProductoCarrito(cartID, productID) {
        try {
            const cart = await this.obtenerCarritoxID(cartID);

            if (!cart){
                console.log("Carrito no encontrado")
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productID);

            //console.log(item)

            await cart.save();
            return cart;
        } catch (error) {
            console.log("Error al actualizar el carrito", error);
            throw error;
        }
    }
}

export default CartManager;