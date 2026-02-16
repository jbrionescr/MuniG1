import { getReportes } from "../services/serviceUsuarios.js"

const reportsList = document.getElementById("reports-list")

async function cargarReportes() {
    const reportes = await getReportes()

    if (reportes.length === 0) {
        reportsList.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No has realizado ningún reporte aún.</td></tr>"
        return
    }

    reportsList.innerHTML = ""
    reportes.forEach(reporte => {
        const row = document.createElement("tr")

        // Formatear la fecha
        const fecha = new Date(reporte.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        row.innerHTML = `
            <td>${reporte.tipo === 'vial' ? 'Reporte Vial' : 'Servicio Público'}</td>
            <td>${reporte.ubicacion}</td>
            <td>${reporte.descripcion}</td>
            <td>${fecha}</td>
            <td><span class="status ${reporte.estado || 'pending'}">${reporte.estado || 'Pendiente'}</span></td>
        `
        reportsList.appendChild(row)
    })
}

document.addEventListener("DOMContentLoaded", cargarReportes)
