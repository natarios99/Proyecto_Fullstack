let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito_fonda')) || [];

// Obtener productos desde Node.js + MySQL
async function cargarProductosDesdeBD() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos');
    if (!respuesta.ok) throw new Error("Error en la respuesta de la API");
    
    productos = await respuesta.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error('Error al conectar con la API de MySQL:', error);
  }
}

// Dibujar los productos en pantalla
function renderizarProductos(lista) {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach((producto) => {
  const col = document.createElement("div");
  col.classList.add("col");

  col.innerHTML = `
    <div class="card h-100 shadow-sm border-0">
      <a href="detalle-producto.html?id=${producto.id}">
        <img src="${producto.imagen}" 
             class="card-img-top" 
             alt="${producto.nombre}"
             style="height: 220px; object-fit: cover;"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Fiestas+Patrias';">
      </a>
      <div class="card-body d-flex flex-column justify-content-between text-center p-3">
        <div>
          <span class="badge bg-danger text-uppercase mb-2">${producto.categoria}</span>
          <h5 class="card-title fs-6 fw-bold mb-2">
            <a href="detalle-producto.html?id=${producto.id}" class="text-decoration-none text-dark">
              ${producto.nombre}
            </a>
          </h5>
          <p class="card-text text-danger fw-bold fs-5 mb-3">$${Number(producto.precio).toLocaleString("es-CL")}</p>
        </div>
        
        <!-- Botones de Acción -->
        <div class="d-grid gap-2">
          <a href="detalle-producto.html?id=${producto.id}" class="btn btn-outline-danger fw-bold">
            <i class="bi bi-eye-fill me-1"></i> Ver detalles
          </a>
          <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-primary fw-bold">
            <i class="bi bi-cart-plus me-1"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  `;


    contenedor.appendChild(col);
  });
}

function agregarAlCarrito(idProducto) {
  const prod = productos.find(p => p.id === idProducto);
  if (!prod) return;

  const enCarrito = carrito.find(item => item.id === idProducto);
  if (enCarrito) {
    enCarrito.cantidad = (enCarrito.cantidad || 1) + 1;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }

  localStorage.setItem('carrito_fonda', JSON.stringify(carrito));
  actualizarContadorNavbar();
  alert(`¡${prod.nombre} agregado al carrito!`);
}

function actualizarContadorNavbar() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    const total = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    badge.innerText = total;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductosDesdeBD();
  actualizarContadorNavbar();
});
