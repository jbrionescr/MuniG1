import { postData } from "../services/serviceUsuarios.js"

const fullname = document.getElementById("fullname")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmpassword = document.getElementById("confirmpassword")
const role = document.getElementById("role")
const registerbutton = document.getElementById("registerbutton")

async function registrarUsuario(e) {
    e.preventDefault()

    const nameValue = fullname.value.trim()
    const emailValue = email.value.trim()
    const passValue = password.value.trim()
    const confirmPassValue = confirmpassword.value.trim()

    if (nameValue === "" || emailValue === "" || passValue === "" || confirmPassValue === "") {
        alert("Todos los campos son obligatorios y no pueden estar vacíos")
        return
    }

    if (passValue.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres")
        return
    }

    if (passValue !== confirmPassValue) {
        alert("Las contraseñas no coinciden")
        return
    }

    const usuario = {
        nombreCompleto: fullname.value,
        email: email.value,
        password: password.value,
        role: role.value
    }

    const res = await postData(usuario)

    if (res) {
        alert("Registro exitoso")
        if (usuario.role === "administrador") {
            window.location.href = "../html/adminDashboard.html"
        } else {
            window.location.href = "../html/reportes.html"
        }
    } else {
        alert("Error al registrar el usuario")
    }
}

registerbutton.addEventListener("click", registrarUsuario)