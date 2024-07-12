import { promises as fs } from 'fs';

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultID = 0;

        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0){
                this.ultID = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos", error);
            //Si el archivo no existe, se crea
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultID, products: []
        };

        this.carts.push(nuevoCarrito)

        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async obtenerCarritoxId(cartID) {
        try {
            const carrito = this.carts.find(c => c.id === cartID);

            if (!carrito) {
                throw new error(`No existe el carri con el ID ${cartID}`);
            }

            return carrito;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async agregarProducto(cartID, productID, quantity = 1) {
        const carrito = await this.obtenerCarritoxId(cartID);
        const existe = carrito.products.find(p => p.product === productID);

        if (existe) {
            existe.quantity += quantity;
        } else {
            carrito.products.push({ product: productID, quantity });
        }

        await this.guardarCarritos();
        return carrito;
    }
}

export default CartManager