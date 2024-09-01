// contenedor donde se mostrarán las tarjetas de productos
const cardContainer = document.getElementById("producto-container");
// Función para crear las tarjetas
function crearProductos(products) {
   const memoria = JSON.parse(localStorage.getItem("products")) || [];  // Recupera los productos almacenados en el carrito desde localStorage o inicia con un array vacío
     

   products.forEach(producto => {
     // se verifica si el producto ya está en el carrito
      const productoEnCarrito = memoria.find(product => product.id === producto.id);
      if (productoEnCarrito) {
          // se ajusta la cantidad disponible en el inventario, si el producto ya está
           producto.cantidadDisponible -= productoEnCarrito.cantidad;
       }
      // Define el contenido HTML  
      const nuevoProducto = document.createElement("div");
      nuevoProducto.classList = "producto-card";
      nuevoProducto.innerHTML = ` 
            
            <img src="./images/${producto.id}.jpg">
            <h4>${producto.nombre}</h4>
            <div class="producto-content">
               <div class="producto-info">
                  
                  <p>Precio: $${producto.precio}.00</p>
                  <p>Disponibles: ${producto.cantidadDisponible}</p>
                  <input type="number" min="1" max="${producto.cantidadDisponible}" value="1" class="cantidad-input">
               </div>
               <div class="popup-main">
                   
                  <a href="#popup" class="carrito-popup"><button class="add-carrito">Agregar al carrito</button></a>
               </div>
            </div>
       `
     // se añade la nueva tarjeta de producto al contenedor en el DOM
      cardContainer.appendChild(nuevoProducto);
      
      nuevoProducto.getElementsByTagName("button")[0].addEventListener("click", () => {
         const cantidadInput = nuevoProducto.querySelector('.cantidad-input');
         const cantidadDeseada = parseInt(cantidadInput.value);
          // Verificar si la cantidad deseada es válida
         if (cantidadDeseada > 0 ) {
            if(cantidadDeseada <= producto.cantidadDisponible){
              // Si la cantidad deseada es menor o igual a la disponible, agrega el producto al carrito
               agregarProducto(producto, cantidadDeseada);
               producto.cantidadDisponible -= cantidadDeseada;  
               nuevoProducto.querySelector('.producto-info p:last-of-type').innerText = `Disponibles: ${producto.cantidadDisponible}`;
            }else{
             // validaciones para agregar productos
               if(producto.cantidadDisponible == 0){
                  alert('Ya no hay más de este producto, intenta agregar uno distinto' );    
               }else{
                  alert('¡Ingresaste muchos! Solamente hay '+ producto.cantidadDisponible + " en la tienda" );
               }
              
            }
           
         } else {
             alert('Debe ingresar una cantidad válida');
         }
         

      });
   });

   
}

   


crearProductos(products);


