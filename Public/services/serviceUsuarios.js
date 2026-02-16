// parte de post 
async function postData(usuario) {
    try {
        const peticion = await fetch("http://localhost:1212/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        })
        const respuesta = await peticion.json()
        console.log(respuesta);
        return respuesta;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export { postData }



// get 

async function getdata() {
    try {
        const respuestaServidor = await fetch("http://localhost:1212/usuarios")
        const datosUsuarios = await respuestaServidor.json()
        console.log(datosUsuarios);
        return datosUsuarios
    }
    catch (error) {
        console.log(error);
    }
}

export { getdata }



/// 