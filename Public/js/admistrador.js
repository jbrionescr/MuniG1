import { getReportes, updateReporteStatus, deleteReporte } from '../services/serviceUsuarios.js';

const reportsTbody = document.getElementById('reports-tbody');

document.addEventListener('DOMContentLoaded', () => {
    loadReports();
});

async function loadReports() {
    const reportes = await getReportes();
    reportsTbody.innerHTML = '';

    reportes.forEach(reporte => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${reporte.id}</td>
            <td>${reporte.tipo}</td>
            <td>${reporte.ubicacion}</td>
            <td>${reporte.descripcion}</td>
            <td>
                <select class="status-select" data-id="${reporte.id}">
                    <option value="Pendiente" ${reporte.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="En Proceso" ${reporte.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                    <option value="Resuelto" ${reporte.estado === 'Resuelto' ? 'selected' : ''}>Resuelto</option>
                </select>
            </td>
            <td>
                <button class="btn-delete" data-id="${reporte.id}">Eliminar</button>
            </td>
        `;
        reportsTbody.appendChild(tr);
    });

    // Event listeners for status change
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const nuevoEstado = e.target.value;
            const res = await updateReporteStatus(id, nuevoEstado);
            if (res) {
                alert('Estado actualizado correctamente');
            } else {
                alert('Error al actualizar el estado');
            }
        });
    });

    // Event listeners for delete
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Está seguro de eliminar este reporte?')) {
                const res = await deleteReporte(id);
                if (res) {
                    alert('Reporte eliminado');
                    loadReports();
                } else {
                    alert('Error al eliminar el reporte');
                }
            }
        });
    });
}
