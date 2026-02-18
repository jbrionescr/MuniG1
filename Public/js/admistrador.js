import {
    getReportes, updateReporteStatus, deleteReporte,
    getProyectos, createProyecto, updateProyecto, deleteProyecto,
    getServicios, createServicio, updateServicio, deleteServicio,
    getFinanciamientos, postFinanciamientos, updateFinanciamiento, deleteFinanciamiento
} from '../services/serviceUsuarios.js';

const btnSalir = document.getElementById("btnSalir")

btnSalir.addEventListener("click", () => {
    window.location.href = "/html/index.html"
})

/* =======================
   NAVEGACIÓN
======================= */

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showSection(link.dataset.section);
    });
});

function showSection(section) {
    const sections = ['reportes', 'proyectos', 'servicios', 'financiamientos'];

    sections.forEach(sec => {
        document.getElementById(`${sec}-section`).style.display =
            sec === section ? 'block' : 'none';
    });
}

/* =======================
   REPORTES
======================= */

async function loadReports() {
    const reportes = await getReportes();
    const tbody = document.getElementById('reports-tbody');
    tbody.innerHTML = '';

    reportes.forEach(r => {
        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.tipo}</td>
                <td>${r.ubicacion}</td>
                <td>${r.descripcion}</td>
                <td>
                    <select onchange="updateStatus(${r.id}, this.value)">
                        <option ${r.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                        <option ${r.estado === "En Proceso" ? "selected" : ""}>En Proceso</option>
                        <option ${r.estado === "Resuelto" ? "selected" : ""}>Resuelto</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteRep(${r.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.updateStatus = async (id, estado) => {
    await updateReporteStatus(id, estado);
    loadReports();
};

window.deleteRep = async (id) => {
    await deleteReporte(id);
    loadReports();
};

/* =======================
   INICIALIZAR
======================= */

loadReports();
