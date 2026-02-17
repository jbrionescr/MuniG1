import { postReporte } from "../services/serviceUsuarios.js"

const reportForm = document.getElementById("report-form")
const reportType = document.getElementById("report-type")
const locationInput = document.getElementById("location")
const descriptionInput = document.getElementById("description")

async function handleReportSubmit(e) {
    e.preventDefault()

    const loc = locationInput.value.trim()
    const desc = descriptionInput.value.trim()

    if (loc === "" || desc === "") {
        alert("Por favor, complete la ubicación y la descripción")
        return
    }

    const reporte = {
        tipo: reportType.value,
        ubicacion: locationInput.value,
        descripcion: descriptionInput.value,
        fecha: new Date().toISOString(),
        estado: "pendiente"
    }

    const res = await postReporte(reporte)

    if (res) {
        alert("Reporte enviado exitosamente")
        reportForm.reset()
    } else {
        alert("Error al enviar el reporte. Por favor, intente de nuevo.")
    }
}

reportForm.addEventListener("submit", handleReportSubmit)
