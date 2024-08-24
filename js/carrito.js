function agregarProducto(producto, cantidad){
    const memoria = JSON.parse(localStorage.getItem("products"));
    console.log(memoria);
    if(!memoria){
        const nuevoProducto = getNuevoProductoMemoria(producto, cantidad);
        localStorage.setItem("products",JSON.stringify([nuevoProducto]));

    }else {
        const indiceProducto = memoria.findIndex(product => product.id === producto.id);
        console.log(indiceProducto);
        
        if (indiceProducto === -1) {
            const nuevoProducto = getNuevoProductoMemoria(producto, cantidad);
            memoria.push(nuevoProducto);
        } else {
            memoria[indiceProducto].cantidad += cantidad;
        }
        
        localStorage.setItem("products", JSON.stringify(memoria));
    }
}

function getNuevoProductoMemoria(producto, cantidad) {
    const nuevoProducto = { ...producto };  
    nuevoProducto.cantidad = cantidad;
    return nuevoProducto;
}
function quitarProducto(producto){
    const memoria = JSON.parse(localStorage.getItem("products"));          
    const indiceProducto = memoria.findIndex(product => product.id === producto.id);
    if(memoria[indiceProducto].cantidad === 1){
        memoria.splice(indiceProducto,1);
        
    }else{
        memoria[indiceProducto].cantidad--;
        
    }
    localStorage.setItem("products",JSON.stringify(memoria));
}
  