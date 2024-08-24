const cardContainer = document.getElementById("cart-container");
const cantidadProduct = document.getElementById("cantidad");
const precioProduct = document.getElementById("precio");
const limpiarCarrito = document.getElementById("limpiar");
const carritoVacio = document.getElementById("carrito-vacio");
const productosHeader = document.getElementById("productos-header");
const productosTotal = document.getElementById("totales");
const comprarBtn = document.getElementById("comprar");

function crearProductos() {
   cardContainer.innerHTML = "";
   const products = JSON.parse(localStorage.getItem("products"));
   console.log(products)
   if (products && products.length > 0) {
      carritoVacio.style.display = "none";
      productosHeader.style.display = "block";
      productosTotal.style.display = "block";
  

      products.forEach((producto) => {
         const nuevoProducto = document.createElement("div");
         nuevoProducto.classList = "carrito-card";
         nuevoProducto.innerHTML = ` 
         
               <img src="./images/${producto.id}.jpg">
       

                  <div class="carrito-info-text">
                     <h4>${producto.nombre}</h3>
                     <p>Precio: $${producto.precio}.00</p>
                     
                  </div>
                    <div class="carrito-add">
                        <button class="quitar">-</button>
                        <span class="cantidad">${producto.cantidad}</span>
                        <button class="añadir">+</button>
                     </div>
          `

         cardContainer.appendChild(nuevoProducto);
         nuevoProducto.getElementsByTagName("button")[1].addEventListener("click", (e) => {
           
            if (producto.cantidad < producto.cantidadDisponible) {
               agregarProducto(producto, 1);  
               crearProductos();  
               totalProductos();
               
           } else {
               alert(`No se puede agregar más. Solo hay ${producto.cantidadDisponible} unidades disponibles.`);
           }
         });
         nuevoProducto.getElementsByTagName("button")[0].addEventListener("click", (e) => {
            
               quitarProducto(producto);
               crearProductos();  
               totalProductos();
         

         });
      });
   }else{
      carritoVacio.style.display = "block";
      cardContainer.style.display = "none";
      productosHeader.style.display = "none";
      productosTotal.style.display = "none";
   }
}


crearProductos();
totalProductos();


function totalProductos(){
   const products  = JSON.parse(localStorage.getItem("products"));
   let cantidadProductos = 0;
   let precio = 0
   if(products && products.length > 0){
       products.forEach(producto => {
           cantidadProductos += producto.cantidad;
           precio += producto.precio * producto.cantidad;
       });
       cantidadProduct.innerText = cantidadProductos;
       precioProduct.innerText = precio;
   }

}
 
document.getElementById("comprar").addEventListener("click", () => {
   if (confirm("¿Deseas completar la compra?")) {
       const products = JSON.parse(localStorage.getItem("products"));
       if (products && products.length > 0) {
           generarFactura(products); 
           localStorage.removeItem("products");  
       } else {
           alert("No hay productos en el carrito.");
       }
   }
});
function generarFactura(products) {
   let facturaHTML = '<h2>Factura</h2><div class="factura-items">';
   let total = 0;
   
   products.forEach(producto => {
       const subtotal = producto.precio * producto.cantidad;
       total += subtotal;
       facturaHTML += `
           <div class="factura-item">
               <p>${producto.nombre} - ${producto.cantidad} x  $${producto.precio }.00 : $${subtotal.toFixed(2)}</p>
           </div>`;
   });
   
   facturaHTML += `
       <div class="factura-total">
           <h3>Total: $${total.toFixed(2)}</h3>
       </div>
       <a href="./index.html" class="carrito-btn">Seguir comprando</a>
   </div>`;

   document.getElementById("cart-container").innerHTML = facturaHTML;
   productosHeader.style.display = "none";
   productosTotal.style.display = "none";
}
 


// ELIMINAR TODOS LOS PRODUCTOS
limpiarCarrito.addEventListener("click", limpiarProduct);
function limpiarProduct(){
   const eliminarConfirm = confirm("¿Estás seguro de que deseas eliminar todos los productos del carrito?");
    
   if (eliminarConfirm) {
  
       localStorage.removeItem("products");
       totalProductos();
       crearProductos();
   }
}