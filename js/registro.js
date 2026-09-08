//Registro de usuario

document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

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
        });
    }
});

// Inicio de sesion


document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email-login').value.trim();
            const password = document.getElementById('password-login').value.trim();

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

            if (usuarioValido) {
                localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
                alert(`¡Ingreso exitoso! Hola de nuevo, ${usuarioValido.nombre}.`);
                window.location.href = 'index.html'; 
            } else {
                alert('El correo electrónico o la contraseña son incorrectos.');
            }
        });
    }
});

