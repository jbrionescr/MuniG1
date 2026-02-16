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

async function postReporte(reporte) {
    try {
        const peticion = await fetch("http://localhost:1212/reportes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reporte)
        })
        const respuesta = await peticion.json()
        console.log(respuesta);
        return respuesta;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getReportes() {
    try {
        const respuestaServidor = await fetch("http://localhost:1212/reportes")
        const datosReportes = await respuestaServidor.json()
        return datosReportes
    } catch (error) {
        console.log(error);
        return []
    }
}

async function deleteReporte(id) {
    try {
        const peticion = await fetch(`http://localhost:1212/reportes/${id}`, {
            method: "DELETE"
        })
        const respuesta = await peticion.json()
        return respuesta;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function updateReporteStatus(id, estado) {
    try {
        const peticion = await fetch(`http://localhost:1212/reportes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ estado })
        })
        const respuesta = await peticion.json()
        return respuesta;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getReporteById(id) {
    try {
        const respuestaServidor = await fetch(`http://localhost:1212/reportes/${id}`)
        const datosReporte = await respuestaServidor.json()
        return datosReporte
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { postData, getdata, postReporte, getReportes, deleteReporte, updateReporteStatus, getReporteById }



/// 