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


document.addEventListener('DOMContentLoaded', () => {
    


    // Registro de usuario
    const formRegistro = document.getElementById('form-registro');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Intentando registrar usuario...");

            try {
                const nombreEl = document.getElementById('nombre');
                const apellidosEl = document.getElementById('apellidos');
                const emailEl = document.getElementById('email-registro');
                const passwordEl = document.getElementById('password-registro');
                const confirmPasswordEl = document.getElementById('confirm-password-registro');

              
                if (!nombreEl || !apellidosEl || !emailEl || !passwordEl || !confirmPasswordEl) {
                    alert("Error interno: Uno o más campos de texto no se encontraron en el HTML. Revisa los IDs.");
                    console.error("Faltan elementos en el DOM:", { nombreEl, apellidosEl, emailEl, passwordEl, confirmPasswordEl });
                    return;
                }

                const nombre = nombreEl.value.trim();
                const apellidos = apellidosEl.value.trim();
                const email = emailEl.value.trim();
                const password = passwordEl.value.trim();
                const confirmPassword = confirmPasswordEl.value.trim();

                if (password !== confirmPassword) {
                    alert('Las contraseñas no coinciden. Por favor, verifica.');
                    return;
                }

                if (password.length < 6) {
                    alert('La contraseña debe tener al menos 6 caracteres.');
                    return;
                }

                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                const existeUsuario = usuarios.some(user => user.email === email);
                if (existeUsuario) {
                    alert('Este correo electrónico ya está registrado con otro cliente.');
                    return;
                }

                const nuevoUsuario = { nombre, apellidos, email, password };
                usuarios.push(nuevoUsuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                alert(`¡Registro exitoso! Bienvenido ${nombre}. Ya puedes iniciar sesión.`);
                window.location.href = 'login.html';

            } catch (error) {
                alert("Ocurrió un error inesperado al registrar. Revisa la consola (F12).");
                console.error(error);
            }
        });
    }

    // Inicio de sesion
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log("Intentando iniciar sesión...");

            try {
                const emailEl = document.getElementById('email-login');
                const passwordEl = document.getElementById('password-login');

                if (!emailEl || !passwordEl) {
                    alert("Error interno: Los campos de inicio de sesión no se encontraron en el HTML.");
                    return;
                }

                const email = emailEl.value.trim();
                const password = passwordEl.value.trim();

                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

                if (usuarioValido) {
                    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
                    alert(`¡Ingreso exitoso! Hola de nuevo, ${usuarioValido.nombre}.`);
                    window.location.href = 'index.html'; 
                } else {
                    alert('El correo electrónico o la contraseña son incorrectos.');
                }

            } catch (error) {
                alert("Ocurrió un error inesperado al iniciar sesión. Revisa la consola (F12).");
                console.error(error);
            }
        });
    }
});



