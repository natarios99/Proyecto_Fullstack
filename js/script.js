let productos = [];
let carrito = [];

// Obtener los productos desde Node.js + MySQL
async function cargarProductosDesdeBD() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos');
    productos = await respuesta.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

// Inyectar las tarjetas Bootstrap en el HTML
function renderizarProductos(lista) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = ""; // Limpia el contenedor

  lista.forEach((producto) => {
    const col = document.createElement("div");
    col.classList.add("col");

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
        <div class="card-body d-flex flex-column justify-content-between text-center">
          <div>
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text text-danger fw-bold fs-5">$${Number(producto.precio).toLocaleString("es-CL")}</p>
          </div>
          <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-primary mt-3">Añadir al carrito</button>
        </div>
      </div>
    `;

    contenedor.appendChild(col);
  });
}

function agregarAlCarrito(id) {
  const item = productos.find(p => p.id === id);
  if (item) {
    carrito.push(item);
    document.getElementById("cart-count").innerText = carrito.length;
    alert(`¡${item.nombre} agregado al carrito!`);
  }
}

// Ejecutar la carga al estar listo el documento
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosDesdeBD();
});
