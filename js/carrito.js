// Agregar productos al carrito
function agregarProducto(producto, cantidad){ //recibe producto y cantidad como parámetros
    const memoria = JSON.parse(localStorage.getItem("products"));
    console.log(memoria);
    if(!memoria){//verificar si el carrito está vacío
        // se agrega el producto si está vacío mediante la función getNuevoProductoMemoria
        const nuevoProducto = getNuevoProductoMemoria(producto, cantidad);
        localStorage.setItem("products",JSON.stringify([nuevoProducto]));

    }else {
        // Si el carrito existe, se busca el mismo producto con mismo ID 
        const indiceProducto = memoria.findIndex(product => product.id === producto.id);
        console.log(indiceProducto);
        
        if (indiceProducto === -1) {
             // si no hay productos, se agrega uno nuevo y la cantidad 
            const nuevoProducto = getNuevoProductoMemoria(producto, cantidad);
            memoria.push(nuevoProducto);
        } else {
            // si hay producto, se incrementa su cantidad
            memoria[indiceProducto].cantidad += cantidad;
        }
        
        localStorage.setItem("products", JSON.stringify(memoria));
    }
}

// Agregar productos a la memoria
function getNuevoProductoMemoria(producto, cantidad) {
    const nuevoProducto = { ...producto };  
    nuevoProducto.cantidad = cantidad;
    return nuevoProducto;
}
// Remover productos del carrito
function quitarProducto(producto){
    const memoria = JSON.parse(localStorage.getItem("products"));          
    const indiceProducto = memoria.findIndex(product => product.id === producto.id);
    // Si solo hay 1 producto, se remueve
    if(memoria[indiceProducto].cantidad === 1){
        memoria.splice(indiceProducto,1);
        
    }else{
         // Si hay varios productos del mismo tipo, se remueve la cantidad/
        memoria[indiceProducto].cantidad--;
        
    }
    localStorage.setItem("products",JSON.stringify(memoria));
}
  
