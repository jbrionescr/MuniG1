import { postData } from "../services/serviceUsuarios.js"

const fullname = document.getElementById("fullname")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmpassword = document.getElementById("confirmpassword")
const registerbutton = document.getElementById("registerbutton")



async function registrarUsuario(e) {
    e.preventDefault()
    const usuario = {
        nombreCompleto: fullname.value,
        email: email.value,
        password: password.value
    }
    await postData(usuario)
}

registerbutton.addEventListener("click", registrarUsuario)