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



// Registro de usuario
document.addEventListener('DOMContentLoaded', () => {
const API_URL = "https://localhost:8081/api/usuarios";

const formRegistro = document.getElementById('form-registro');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (evento) => { 
            evento.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const email = document.getElementById('email-registro').value.trim();
            const password = document.getElementById('password-registro').value.trim();
            const confirmPassword = document.getElementById('confirm-password-registro').value.trim();

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, verifica.');
                return;
            }

            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            const nuevoUsuario = { nombre, apellidos, email, password };

            try {
                const respuesta = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoUsuario) 
                });

                if (respuesta.ok) {
                    alert(`¡Registro exitoso! Bienvenido ${nombre}. Ya puedes iniciar sesión.`);
                    window.location.href = 'login.html'; 
                } else {
                    alert('Hubo un problema al guardar el usuario en el servidor.');
                }

            } catch (error) {
                alert('Error de conexión: No se pudo conectar con la base de datos externa.');
            }
        });
    }

    // Inicio de sesion
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async (evento) => {
            evento.preventDefault();

            const email = document.getElementById('email-login').value.trim();
            const password = document.getElementById('password-login').value.trim();

            try {
                const respuesta = await fetch(`${API_URL}?email=${email}&password=${password}`);
                const resultadoBusqueda = await respuesta.json(); 

                if (resultadoBusqueda.length > 0) {
                    const usuarioValido = resultadoBusqueda[0];
                    
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
                    
                    alert(`¡Ingreso exitoso! Hola de nuevo, ${usuarioValido.nombre}.`);
                    window.location.href = 'index.html';
                } else {
                    alert('El correo electrónico o la contraseña son incorrectos.');
                }

            } catch (error) {
                alert('Error de conexión: No se pudo validar los datos con el servidor.');
            }
        });
    }
});



