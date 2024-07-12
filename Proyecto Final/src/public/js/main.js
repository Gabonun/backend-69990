const socket = io(); 

socket.on("productos", (data) => {
    renderProductos(data);
})

//Función para renderizar nuestros productos: 

const renderProductos = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div"); 
        
        card.innerHTML = `  <p> ${item.id} </p>
                            <p> ${item.name} </p>
                            <p> ${item.description} </p>
                            <p> ${item.price} </p>
                            <button> Eliminar </button>
                        `
        contenedorProductos.appendChild(card); 
        //Agregamos un evento al boton de eliminar: 
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id); 
        })
    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id); 
}

//Agregamos productos con el formulario: 

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})


const agregarProducto = () => {
    const producto = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        status: document.getElementById("status").value === "true",
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        image: document.getElementById("image").value,
        price: document.getElementById("price").value,
    }

    socket.emit("agregarProducto", producto);
}