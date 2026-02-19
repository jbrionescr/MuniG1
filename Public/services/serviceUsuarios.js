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

// --- SERVICES PROYECTOS ---

async function getProyectos() {
    try {
        const res = await fetch("http://localhost:1212/proyectos");
        return await res.json();
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function createProyecto(data) {
    try {
        const res = await fetch("http://localhost:1212/proyectos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function updateProyecto(id, data) {
    try {
        const res = await fetch(`http://localhost:1212/proyectos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteProyecto(id) {
    try {
        const res = await fetch(`http://localhost:1212/proyectos/${id}`, {
            method: "DELETE"
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

// --- SERVICES SERVICIOS PÚBLICOS ---

async function getServicios() {
    try {
        const res = await fetch("http://localhost:1212/servicios");
        return await res.json();
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function createServicio(data) {
    try {
        const res = await fetch("http://localhost:1212/servicios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function updateServicio(id, data) {
    try {
        const res = await fetch(`http://localhost:1212/servicios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteServicio(id) {
    try {
        const res = await fetch(`http://localhost:1212/servicios/${id}`, {
            method: "DELETE"
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}


async function getFinanciamientos() {
    try {
        const res = await fetch("http://localhost:1212/financiamientos");
        return await res.json();
    } catch (error) {
        console.log(error);
        return [];
    }
}

async function postFinanciamientos(obj) {
    try {
        const res = await fetch("http://localhost:1212/financiamientos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function updateFinanciamiento(id, data) {
    try {
        const res = await fetch(`http://localhost:1212/financiamientos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteFinanciamiento(id) {
    try {
        const res = await fetch(`http://localhost:1212/financiamientos/${id}`, {
            method: "DELETE"
        });
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function updateUserRole(id, role) {
    try {
        const peticion = await fetch(`http://localhost:1212/usuarios/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role })
        })
        const respuesta = await peticion.json()
        return respuesta;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteUser(id) {
    try {
        const peticion = await fetch(`http://localhost:1212/usuarios/${id}`, {
            method: "DELETE"
        })
        const respuesta = await peticion.json()
        return respuesta;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { getFinanciamientos, postData, getdata, postReporte, getReportes, deleteReporte, updateReporteStatus, getReporteById, getProyectos, createProyecto, updateProyecto, deleteProyecto, getServicios, createServicio, updateServicio, deleteServicio, postFinanciamientos, updateFinanciamiento, deleteFinanciamiento, updateUserRole, deleteUser }