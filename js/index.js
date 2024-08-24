const cardContainer = document.getElementById("producto-container");
 
function crearProductos(products) {
   const memoria = JSON.parse(localStorage.getItem("products")) || [];
     

   products.forEach(producto => {
      const productoEnCarrito = memoria.find(product => product.id === producto.id);
      if (productoEnCarrito) {
           producto.cantidadDisponible -= productoEnCarrito.cantidad;
       }

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
      cardContainer.appendChild(nuevoProducto);
      
      nuevoProducto.getElementsByTagName("button")[0].addEventListener("click", () => {
         const cantidadInput = nuevoProducto.querySelector('.cantidad-input');
         const cantidadDeseada = parseInt(cantidadInput.value);
         
         if (cantidadDeseada > 0 ) {
            if(cantidadDeseada <= producto.cantidadDisponible){
               agregarProducto(producto, cantidadDeseada);
               producto.cantidadDisponible -= cantidadDeseada;  
               nuevoProducto.querySelector('.producto-info p:last-of-type').innerText = `Disponibles: ${producto.cantidadDisponible}`;
            }else{
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


