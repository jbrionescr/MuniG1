import { getdata } from "../services/serviceUsuarios.js"

const email = document.getElementById("email")
const password = document.getElementById("password")
const loginForm = document.getElementById("login-form")


async function obtenerUsuarios(event) {
    event.preventDefault() // Evita que la página se recargue
    console.log("Intentando iniciar sesión...")

    try {
        const usuariosRegistrados = await getdata()
        console.log("Usuarios recibidos del servidor:", usuariosRegistrados)

        if (!usuariosRegistrados) {
            alert("No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.")
            return;
        }

        const usuarioValido = usuariosRegistrados.find((usuario) =>
            usuario.email === email.value && usuario.password === password.value
        )
        console.log("Usuario encontrado:", usuarioValido)

        if (usuarioValido) {
            alert("Sesión iniciada correctamente")

            if (usuarioValido.role === "administrador") {
                window.location.href = "../html/adminDashboard.html"
            } else if (usuarioValido.role === "ciudadano") {
                window.location.href = "../html/reportes.html"
            } else {
                // Por defecto si no tiene rol o es otro
                window.location.href = "../html/reportes.html"
            }
        } else {
            alert("Credenciales incorrectas")
        }
    } catch (error) {
        console.error("Error en el login:", error)
        alert("Ocurrió un error al intentar iniciar sesión.")
    }
}

loginForm.addEventListener("submit", obtenerUsuarios)
