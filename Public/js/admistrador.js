import {
    getReportes, updateReporteStatus, deleteReporte,
    getProyectos, createProyecto, updateProyecto, deleteProyecto,
    getServicios, createServicio, updateServicio, deleteServicio,
    getFinanciamientos, postFinanciamientos, updateFinanciamiento, deleteFinanciamiento,
    getdata, updateUserRole, deleteUser
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
    const sections = ['reportes', 'proyectos', 'servicios', 'financiamientos', 'usuarios'];

    sections.forEach(sec => {
        document.getElementById(`${sec}-section`).style.display =
            sec === section ? 'block' : 'none';
    });

    if (section === 'usuarios') {
        loadUsers();
    }
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
   USUARIOS
======================= */

async function loadUsers() {
    const usuarios = await getdata();
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';

    usuarios.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombreCompleto}</td>
                <td>${u.email}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="changeRole('${u.id}', this.value)">
                        <option value="ciudadano" ${u.role === "ciudadano" ? "selected" : ""}>Ciudadano</option>
                        <option value="administrador" ${u.role === "administrador" ? "selected" : ""}>Administrador</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteUserAction('${u.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

window.changeRole = async (id, role) => {
    if (confirm(`¿Estás seguro de que deseas cambiar el rol a ${role}?`)) {
        await updateUserRole(id, role);
        loadUsers();
    } else {
        loadUsers(); // Revert selection
    }
};

window.deleteUserAction = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        await deleteUser(id);
        loadUsers();
    }
};

/* =======================
   INICIALIZAR
======================= */

loadReports();
