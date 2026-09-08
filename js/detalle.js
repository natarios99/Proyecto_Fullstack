const urlParams = new URLSearchParams(window.location.search);
const productoId = parseInt(urlParams.get('id'));

let carrito = JSON.parse(localStorage.getItem('carrito_fonda')) || [];

// 1. Consultar la API o respaldo local
async function obtenerDetalle() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos');
    if (!respuesta.ok) throw new Error("Error al obtener productos");
    
    const productos = await respuesta.json();
    const producto = productos.find(p => p.id === productoId);

    if (producto) {
      renderizarDetalle(producto);
    } else {
      mostrarError("Producto no encontrado en la base de datos.");
    }
  } catch (error) {
    console.warn("Backend no disponible. Cargando producto desde memoria...", error);
    
    // Lista local de contingencia con tus imágenes de la carpeta img/
    const respaldo = [
      { id: 1, nombre: "Banderines Tricolor (10M)", precio: 3990, categoria: "decoracion", imagen: "img/banderines.webp", descripcion: "Guirnalda plástica tricolor de 10 metros, resistente a la intemperie." },
      { id: 2, nombre: "Set Copihues Artificiales (6 un)", precio: 5990, categoria: "decoracion", imagen: "img/copihues-artificiales.webp", descripcion: "Pack de 6 copihues de seda sintética roja con hojas verdes flexibles." },
      { id: 3, nombre: "Emboque de Madera", precio: 4500, categoria: "juegos", imagen: "img/emboque.webp", descripcion: "Emboque artesanal hecho en madera de pino pulida con cordón reforzado." },
      { id: 4, nombre: "Guirnalda Papel Volantín", precio: 1990, categoria: "decoracion", imagen: "img/guirnalda.webp", descripcion: "Guirnalda extensible de 3 metros en papel tricolor para interiores." },
      { id: 5, nombre: "Manta Huasa Tradicional", precio: 24990, categoria: "vestimenta", imagen: "img/manta.jpg", descripcion: "Manta huasa tejida con motivos folclóricos tradicionales de la zona central." },
      { id: 6, nombre: "Mantel Plástico Diseño Patrio", precio: 2990, categoria: "parrilla", imagen: "img/mantel.webp", descripcion: "Mantel plástico impermeable con estampado de la bandera chilena de 1.40 x 2.00 m." },
      { id: 7, nombre: "Juego de la Rayuela Completo", precio: 18990, categoria: "juegos", imagen: "img/Rayuela.jpg", descripcion: "Kit completo con cajón de madera, greda y 2 tejos metálicos pesados." },
      { id: 8, nombre: "Set Parrillero (Pinzas y Cuchillo)", precio: 15990, categoria: "parrilla", imagen: "img/set-parrilla.webp", descripcion: "Trío de utensilios de acero inoxidable con mango aislante de calor." },
      { id: 9, nombre: "Sombrero de Huaso de Paño", precio: 12990, categoria: "vestimenta", imagen: "img/sombrero-huaso.jpg", descripcion: "Sombrero negro de paño denso con ala ancha y cinta decorativa." },
      { id: 10, nombre: "Trompo de Madera con Liza", precio: 3500, categoria: "juegos", imagen: "img/trompo.jpg", descripcion: "Confeccionado en madera nativa con punta metálica y liza de algodón." },
      { id: 11, nombre: "Vestido de China Tradicional", precio: 21990, categoria: "vestimenta", imagen: "img/vestido-china.webp", descripcion: "Vestido floreado con encajes y faldón con volumen para baile de cueca." },
      { id: 12, nombre: "Volantín de Plástico con Hilo", precio: 2500, categoria: "juegos", imagen: "img/volantin.webp", descripcion: "Volantín de plástico resistente con carrete de 100 m de hilo seguro." }
    ];

    const prodRespaldo = respaldo.find(p => p.id === productoId);
    if (prodRespaldo) {
      renderizarDetalle(prodRespaldo);
    } else {
      mostrarError("No se encontró el producto especificado.");
    }
  }
}

// 2. Dibujar la vista en el HTML
function renderizarDetalle(producto) {
  const contenedor = document.getElementById("detalle-container");
  
  const descTexto = producto.descripcion || 
    `Disfruta estas Fiestas Patrias con ${producto.nombre}. Artículo de excelente calidad garantizada para tus celebraciones dieciocheras. Categoría: ${producto.categoria.toUpperCase()}.`;

  contenedor.innerHTML = `
    <!-- Imagen del producto -->
    <div class="col-md-6 text-center">
      <img src="${producto.imagen}" 
           alt="${producto.nombre}" 
           class="img-fluid rounded-3 shadow-sm border w-100" 
           style="max-height: 380px; object-fit: cover;"
           onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=Fiestas+Patrias';">
    </div>

    <!-- Información y Botones -->
    <div class="col-md-6">
      <span class="badge bg-danger text-uppercase mb-2">${producto.categoria}</span>
      <h2 class="fw-bold text-dark mb-2">${producto.nombre}</h2>
      <h3 class="text-danger fw-bold mb-4">$${Number(producto.precio).toLocaleString("es-CL")}</h3>

      <div class="mb-4">
        <h5 class="fw-semibold text-secondary">Detalle del Producto:</h5>
        <p class="text-muted leading-relaxed">${descTexto}</p>
      </div>

      <!-- Control de Cantidad y Agregar -->
      <div class="row g-3 align-items-center mt-3">
        <div class="col-auto">
          <label for="cantidadInput" class="form-label fw-bold mb-0">Cantidad:</label>
        </div>
        <div class="col-auto">
          <input type="number" id="cantidadInput" class="form-control text-center fw-bold" value="1" min="1" max="20" style="width: 80px;">
        </div>
        <div class="col-12 col-sm-auto flex-grow-1">
          <button onclick="agregarCantidadAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio}, '${producto.imagen}')" 
                  class="btn btn-primary btn-lg w-100 fw-bold shadow-sm">
            <i class="bi bi-cart-plus-fill me-2"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  `;
}

// 3. Agregar la cantidad seleccionada al LocalStorage
function agregarCantidadAlCarrito(id, nombre, precio, imagen) {
  const cantidadSel = parseInt(document.getElementById("cantidadInput").value) || 1;

  const itemExistente = carrito.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.cantidad = (itemExistente.cantidad || 1) + cantidadSel;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: cantidadSel });
  }

  localStorage.setItem('carrito_fonda', JSON.stringify(carrito));
  actualizarContadorNavbar();
  alert(`¡Se agregaron ${cantidadSel} unidad(es) de "${nombre}" al carrito de compra!`);
}

function actualizarContadorNavbar() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    const total = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    badge.innerText = total;
  }
}

function mostrarError(mensaje) {
  const contenedor = document.getElementById("detalle-container");
  contenedor.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle text-warning display-1"></i>
      <h3 class="mt-3 text-dark">${mensaje}</h3>
      <a href="productos.html" class="btn btn-primary mt-3">Volver al catálogo</a>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorNavbar();
  if (productoId) {
    obtenerDetalle();
  } else {
    mostrarError("No se ha seleccionado ningún producto.");
  }
});
