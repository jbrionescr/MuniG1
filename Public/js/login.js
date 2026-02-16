import { getdata } from "../services/serviceUsuarios.js"

const fullname = document.getElementById("fullname")
const email = document.getElementById("email")
const password = document.getElementById("password")
const btnprimary = document.getElementById("btnprimary")


async function obtenerUsuarios() {
    const usuariosRegistrados = await getdata()

    const usuarioValido = usuariosRegistrados.find((usuario) => usuario.email === email.value && usuario.password === password.value)
    console.log(usuarioValido)

    if (usuarioValido) {
        alert("Sesión iniciada correctamente")

        if (usuarioValido.role === "administrador") {
            window.location.href = "../html/adminDashboard.html"
        } else {
            window.location.href = "../html/reportes.html"
        }
    } else {
        alert("Credenciales incorrectas")
    }

}

btnprimary.addEventListener("click", obtenerUsuarios)



