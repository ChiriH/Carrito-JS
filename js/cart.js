const cardContainer = document.getElementById("cart-container");
const cantidadProduct = document.getElementById("cantidad");
const precioProduct = document.getElementById("precio");
const limpiarCarrito = document.getElementById("limpiar");
const carritoVacio = document.getElementById("carrito-vacio");
const productosHeader = document.getElementById("productos-header");
const productosTotal = document.getElementById("totales");
const comprarBtn = document.getElementById("comprar");
const { jsPDF } = window.jspdf;
const paymentFormContainer = document.getElementById("payment-form-container");
const paymentForm = document.getElementById("payment-form");
const expiryMonthSelect = document.getElementById("expiryMonth");
const expiryYearSelect = document.getElementById("expiryYear");
const cardNumberError = document.getElementById("cardNumberError");

// Función para crear y mostrar los productos en el carrito de compras
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

// Función para actualizar la cantidad total de productos y precios
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

// Función para llenar dinámicamente los selectores de mes y año
function populateExpiryDateOptions() {
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i < 10 ? '0' + i : i;
        option.text = i < 10 ? '0' + i : i;
        expiryMonthSelect.add(option);
    }
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 6; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.text = i;
        expiryYearSelect.add(option);
    }
}

populateExpiryDateOptions(); // Llamada para llenar las opciones al cargar el script

document.getElementById("comprar").addEventListener("click", () => {
    const products = JSON.parse(localStorage.getItem("products"));
    if (products && products.length > 0) {
        cardContainer.style.display = "none";
        carritoVacio.style.display = "none";
        productosHeader.style.display = "none";
        productosTotal.style.display = "none";
        paymentFormContainer.style.display = "flex"; // Asegura que el formulario esté centrado
        paymentForm.addEventListener("submit", handlePaymentFormSubmit);
    } else {
        alert("No hay productos en el carrito.");
    }
});

function handlePaymentFormSubmit(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Obtener y limpiar valores
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, ''); // Remover espacios
    const expiryMonth = document.getElementById("expiryMonth").value;
    const expiryYear = document.getElementById("expiryYear").value;
    const cvv = document.getElementById("cvv").value;
    const cardHolder = document.getElementById("cardHolder").value;

    let isValid = true;

    // Validar número de tarjeta
    if (!validateCardNumber(cardNumber)) {
        cardNumberError.style.display = "block";
        isValid = false;
    } else {
        cardNumberError.style.display = "none";
    }

    // Solo mostrar el mensaje de confirmación si todos los datos son válidos
    if (isValid) {
        if (confirm("¿Deseas confirmar la compra?")) { 
            const products = JSON.parse(localStorage.getItem("products"));
            generarFactura(products, cardHolder, cardNumber); 
            localStorage.removeItem("products");  
            alert("¡Gracias por comprar con nosotros!");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);  // 3 segundos de retraso
        }
    }
}

function validateCardNumber(cardNumber) {
    const cardNumberRegex = /^[0-9]{13,16}$/;
    return cardNumberRegex.test(cardNumber);
}

document.getElementById("cardNumber").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value;
});

function generarFactura(products, cardHolder, cardNumber) {
    const doc = new jsPDF();
    
    // Fecha y hora de la compra
    const date = new Date();
    const dateString = date.toLocaleDateString() + " " + date.toLocaleTimeString();

    // Últimos 4 dígitos del número de tarjeta
    const lastFourDigits = cardNumber.slice(-4);

    // Encabezado de la factura
    doc.setFontSize(18);
    doc.text("Factura Electrónica", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Fecha y Hora: ${dateString}`, 20, 30);
    doc.text(`Titular de la Tarjeta: ${cardHolder}`, 20, 40);
    doc.text(`Método de Pago: Tarjeta terminada en ${lastFourDigits}`, 20, 50);

    // Tabla de productos
    doc.setFontSize(14);
    doc.text("Productos", 20, 70);
    doc.setFontSize(12);
    let positionY = 80;
    products.forEach(producto => {
        doc.text(`- ${producto.nombre}: ${producto.cantidad} x $${producto.precio}.00`, 20, positionY);
        positionY += 10;
    });

    // Calcular total
    const total = products.reduce((sum, product) => sum + product.precio * product.cantidad, 0);

    doc.text(`Total: $${total.toFixed(2)}`, 20, positionY + 10);

    // Estilo y descarga de la factura
    doc.save("factura-electronica.pdf");
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