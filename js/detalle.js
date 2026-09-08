// Obtener el ID del producto desde la URL (?id=X)
const urlParams = new URLSearchParams(window.location.search);
const productoId = parseInt(urlParams.get('id'));

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// 1. Cargar el producto desde el backend o fallback local
async function obtenerDetalleProducto() {
  try {
    // Intentar consultar al servidor backend
    const respuesta = await fetch(`http://localhost:3000/api/productos`);
    const productos = await respuesta.json();
    const producto = productos.find(p => p.id === productoId);

    if (producto) {
      renderizarDetalle(producto);
    } else {
      mostrarError("Producto no encontrado en el catálogo.");
    }
  } catch (error) {
    console.warn("Backend no disponible, intentando cargar datos locales de prueba...");
    
    // Lista local de contingencia
    const productosLocales = [
      { id: 1, nombre: "Banderines Tricolor (10M)", precio: 3990, categoria: "decoracion", imagen: "img/banderines.jpg", descripcion: "Guirnalda de banderines tricolor en plástico resistente de 10 metros de largo. Ideal para exterior e interior, resistente a la intemperie." },
      { id: 2, nombre: "Manta Huasa Tradicional", precio: 24990, categoria: "vestimenta", imagen: "img/manta-huasa.jpg", descripcion: "Manta huasa tejida con diseños tradicionales de la zona central de Chile. Talla estándar para adulto, suave y abrigadora." },
      { id: 3, nombre: "Emboque de Madera", precio: 4500, categoria: "juegos", imagen: "img/emboque.jpg", descripcion: "Emboque artesanal hecho en madera de pino pulida y barnizada. Incluye cordón reforzado. Ideal para juegos típicos criollos." }
    ];

    const producto = productosLocales.find(p => p.id === productoId);
    if (producto) {
      renderizarDetalle(producto);
    } else {
      mostrarError("No se pudo cargar la información del producto.");
    }
  }
}

// 2. Dibujar el detalle en la pantalla
function renderizarDetalle(producto) {
  const contenedor = document.getElementById("detalle-container");
  
  // Descripción genérica si la BD no incluye el campo 'descripcion'
  const descripcionTexto = producto.descripcion || 
    `Disfruta estas Fiestas Patrias con este excelente producto: ${producto.nombre}. Fabricado con materiales de alta calidad y pensado para acompañar tus celebraciones dieciocheras en familia o con amigos. Categoría: ${producto.categoria.toUpperCase()}.`;

  contenedor.innerHTML = `
    <!-- Imagen del Producto -->
    <div class="col-md-6 text-center">
      <img src="${producto.imagen}" 
           alt="${producto.nombre}" 
           class="img-fluid rounded-3 shadow-sm border style="max-height: 400px; width: 100%; object-fit: cover;"
           onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=Fiestas+Patrias';">
    </div>

    <!-- Información y Acciones -->
    <div class="col-md-6">
      <span class="badge bg-danger text-uppercase mb-2">${producto.categoria}</span>
      <h2 class="fw-bold text-dark mb-3">${producto.nombre}</h2>
      
      <h3 class="text-danger fw-bold mb-4">$${Number(producto.precio).toLocaleString("es-CL")}</h3>

      <div class="mb-4">
        <h5 class="fw-semibold text-secondary">Detalle del Producto:</h5>
        <p class="text-muted leading-relaxed">${descripcionTexto}</p>
      </div>

      <!-- Cantidad y Botón Añadir al Carrito -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-auto">
          <label for="cantidadInput" class="col-form-label fw-bold">Cantidad:</label>
        </div>
        <div class="col-auto">
          <input type="number" id="cantidadInput" class="form-control text-center" value="1" min="1" max="99" style="width: 80px;">
        </div>
        <div class="col-12 col-sm-auto flex-grow-1">
          <button onclick="agregarDetalleAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')" 
                  class="btn btn-primary btn-lg w-100 shadow-sm">
            <i class="bi bi-cart-plus-fill me-2"></i> Añadir al carrito de compra
          </button>
        </div>
      </div>
    </div>
  `;
}

// 3. Función para añadir desde la vista de detalle
function agregarDetalleAlCarrito(id, nombre, precio, imagen) {
  const cantidad = parseInt(document.getElementById("cantidadInput").value) || 1;

  const itemExistente = carrito.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  alert(`¡Se agregaron ${cantidad} unidad(es) de "${nombre}" al carrito de compra!`);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("cart-count");
  if (contador) {
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    contador.innerText = totalItems;
  }
}

function mostrarError(mensaje) {
  const contenedor = document.getElementById("detalle-container");
  contenedor.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle-fill text-warning display-1"></i>
      <h3 class="mt-3">${mensaje}</h3>
      <a href="productos.html" class="btn btn-primary mt-3">Volver al catálogo</a>
    </div>
  `;
}

// Inicializar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();
  if (productoId) {
    obtenerDetalleProducto();
  } else {
    mostrarError("No se ha especificado ningún producto.");
  }
});