let listaProductos = [];
let listaUsuarios = [
  { id: 1, nombre: "Administrador General", email: "admin@fondavirtual.cl", rol: "Administrador" },
  { id: 2, nombre: "Juan Pérez", email: "juan.perez@gmail.com", rol: "Cliente" },
  { id: 3, nombre: "Maria González", email: "maria.g@hotmail.com", rol: "Cliente" }
];

// Cambiar vistas usando el Menú Vertical Lateral
function cambiarSeccion(seccion) {
  const secProductos = document.getElementById("seccion-productos");
  const secUsuarios = document.getElementById("seccion-usuarios");
  const btnProductos = document.getElementById("btn-tab-productos");
  const btnUsuarios = document.getElementById("btn-tab-usuarios");

  if (seccion === 'productos') {
    secProductos.style.display = "block";
    secUsuarios.style.display = "none";
    btnProductos.classList.add("active");
    btnUsuarios.classList.remove("active");
  } else {
    secProductos.style.display = "none";
    secUsuarios.style.display = "block";
    btnProductos.classList.remove("active");
    btnUsuarios.classList.add("active");
  }
}

// ================= 1. MANTENEDOR DE PRODUCTOS =================

async function cargarProductosAdmin() {
  try {
    const res = await fetch('http://localhost:3000/api/productos');
    listaProductos = await res.json();
    renderizarTablaProductos();
  } catch (error) {
    console.warn("Backend no activo. Cargando datos locales...");
    listaProductos = [
      { id: 1, nombre: "Banderines Tricolor (10M)", precio: 3990, categoria: "decoracion", imagen: "img/banderines.jpg" },
      { id: 2, nombre: "Manta Huasa Tradicional", precio: 24990, categoria: "vestimenta", imagen: "img/manta-huasa.jpg" },
      { id: 3, nombre: "Emboque de Madera", precio: 4500, categoria: "juegos", imagen: "img/emboque.jpg" }
    ];
    renderizarTablaProductos();
  }
}

function renderizarTablaProductos() {
  const tbody = document.getElementById("tabla-productos-body");
  tbody.innerHTML = "";

  if (listaProductos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No hay productos registrados.</td></tr>`;
    return;
  }

  listaProductos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-bold">#${p.id}</td>
      <td>
        <img src="${p.imagen}" alt="${p.nombre}" style="width: 45px; height: 45px; object-fit: cover;" class="rounded border"
             onerror="this.src='https://via.placeholder.com/45?text=Foto'">
      </td>
      <td class="fw-semibold">${p.nombre}</td>
      <td><span class="badge bg-secondary text-uppercase">${p.categoria}</span></td>
      <td class="text-danger fw-bold">$${Number(p.precio).toLocaleString("es-CL")}</td>
      <td class="text-center">
        <button onclick="eliminarProducto(${p.id})" class="btn btn-sm btn-outline-danger" title="Eliminar">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function guardarNuevoProducto(e) {
  e.preventDefault();
  const nuevo = {
    nombre: document.getElementById("prodNombre").value,
    precio: parseInt(document.getElementById("prodPrecio").value),
    categoria: document.getElementById("prodCategoria").value,
    imagen: document.getElementById("prodImagen").value,
    descripcion: document.getElementById("prodDescripcion").value
  };

  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });

    if (res.ok) {
      alert("¡Producto creado exitosamente en MySQL!");
      cargarProductosAdmin();
    }
  } catch (error) {
    // Si falla la API, guardado local temporal
    nuevo.id = listaProductos.length ? Math.max(...listaProductos.map(p => p.id)) + 1 : 1;
    listaProductos.push(nuevo);
    renderizarTablaProductos();
    alert("¡Producto agregado localmente!");
  }

  // Cerrar Modal y resetear formulario
  const modalEl = document.getElementById("modalCrearProducto");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  document.getElementById("formCrearProducto").reset();
}

function eliminarProducto(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    listaProductos = listaProductos.filter(p => p.id !== id);
    renderizarTablaProductos();
  }
}

// ================= 2. MANTENEDOR DE USUARIOS =================

function renderizarTablaUsuarios() {
  const tbody = document.getElementById("tabla-usuarios-body");
  tbody.innerHTML = "";

  listaUsuarios.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-bold">#${u.id}</td>
      <td class="fw-semibold">${u.nombre}</td>
      <td>${u.email}</td>
      <td>
        <span class="badge ${u.rol === 'Administrador' ? 'bg-danger' : 'bg-info text-dark'}">
          ${u.rol}
        </span>
      </td>
      <td class="text-center">
        <button onclick="eliminarUsuario(${u.id})" class="btn btn-sm btn-outline-danger" title="Eliminar">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function guardarNuevoUsuario(e) {
  e.preventDefault();
  const nuevo = {
    id: listaUsuarios.length ? Math.max(...listaUsuarios.map(u => u.id)) + 1 : 1,
    nombre: document.getElementById("usrNombre").value,
    email: document.getElementById("usrEmail").value,
    rol: document.getElementById("usrRol").value
  };

  listaUsuarios.push(nuevo);
  renderizarTablaUsuarios();
  alert("¡Usuario creado exitosamente!");

  // Cerrar Modal y resetear formulario
  const modalEl = document.getElementById("modalCrearUsuario");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  document.getElementById("formCrearUsuario").reset();
}

function eliminarUsuario(id) {
  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    listaUsuarios = listaUsuarios.filter(u => u.id !== id);
    renderizarTablaUsuarios();
  }
}

// Carga Inicial
document.addEventListener("DOMContentLoaded", () => {
  cargarProductosAdmin();
  renderizarTablaUsuarios();
});