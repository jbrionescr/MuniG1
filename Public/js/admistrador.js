import { getReportes, updateReporteStatus, deleteReporte, getProyectos, createProyecto, updateProyecto, deleteProyecto, getServicios, createServicio, updateServicio, deleteServicio } from '../services/serviceUsuarios.js';

const reportsTbody = document.getElementById('reports-tbody');
const projectsTbody = document.getElementById('projects-tbody');
const servicesTbody = document.getElementById('services-tbody');
const reportsSection = document.getElementById('reports-section');
const projectsSection = document.getElementById('projects-section');
const servicesSection = document.getElementById('services-section');
const projectForm = document.getElementById('project-form');
const serviceForm = document.getElementById('service-form');

document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    setupNavigation();
});

function setupNavigation() {
    const links = document.querySelectorAll('.sidebar-nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const text = e.target.closest('li').textContent.trim();
            if (text.includes('Gestión de Reportes')) {
                e.preventDefault();
                showSection('reportes');
            } else if (text.includes('Gestión de Proyectos Viales')) {
                e.preventDefault();
                showSection('proyectos');
            } else if (text.includes('Gestión de Servicios Públicos')) {
                e.preventDefault();
                showSection('servicios');
            }
        });
    });
}

function showSection(section) {
    reportsSection.style.display = section === 'reportes' ? 'block' : 'none';
    projectsSection.style.display = section === 'proyectos' ? 'block' : 'none';
    servicesSection.style.display = section === 'servicios' ? 'block' : 'none';

    if (section === 'reportes') loadReports();
    if (section === 'proyectos') loadProjects();
    if (section === 'servicios') loadServices();
}

// --- REPORTES LOGIC ---
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

// --- PROYECTOS LOGIC ---
async function loadProjects() {
    const proyectos = await getProyectos();
    projectsTbody.innerHTML = '';

    proyectos.forEach(proyecto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${proyecto.nombre}</td>
            <td>${proyecto.descripcion}</td>
            <td>${proyecto.presupuesto}</td>
            <td>${proyecto.fechaInicio}</td>
            <td>${proyecto.estado}</td>
            <td>
                <button class="btn-edit-project" data-id="${proyecto.id}" style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">Editar</button>
                <button class="btn-delete-project" data-id="${proyecto.id}" style="background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Eliminar</button>
            </td>
        `;
        projectsTbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-edit-project').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const project = proyectos.find(p => p.id === id);
            if (project) {
                document.getElementById('project-id').value = project.id;
                document.getElementById('project-name').value = project.nombre;
                document.getElementById('project-budget').value = project.presupuesto;
                document.getElementById('project-date').value = project.fechaInicio;
                document.getElementById('project-status').value = project.estado;
                document.getElementById('project-desc').value = project.descripcion;

                document.getElementById('project-form-title').textContent = 'Editar Proyecto';
                document.getElementById('btn-cancel-project').style.display = 'inline-block';
            }
        });
    });

    document.querySelectorAll('.btn-delete-project').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Eliminar proyecto?')) {
                await deleteProyecto(id);
                loadProjects();
            }
        });
    });
}

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('project-id').value;
    const nombre = document.getElementById('project-name').value.trim();
    const presupuesto = document.getElementById('project-budget').value.trim();
    const fechaInicio = document.getElementById('project-date').value.trim();
    const estado = document.getElementById('project-status').value;
    const descripcion = document.getElementById('project-desc').value.trim();

    if (nombre === "" || presupuesto === "" || fechaInicio === "" || descripcion === "") {
        alert("Por favor, complete todos los campos del proyecto.");
        return;
    }

    const data = {
        nombre,
        presupuesto,
        fechaInicio,
        estado,
        descripcion
    };

    let res;
    if (id) {
        res = await updateProyecto(id, data);
    } else {
        res = await createProyecto(data);
    }

    if (res) {
        alert(id ? 'Proyecto actualizado' : 'Proyecto creado');
        resetProjectForm();
        loadProjects();
    } else {
        alert('Error al guardar proyecto');
    }
});

document.getElementById('btn-cancel-project').addEventListener('click', resetProjectForm);

function resetProjectForm() {
    projectForm.reset();
    document.getElementById('project-id').value = '';
    document.getElementById('project-form-title').textContent = 'Crear Nuevo Proyecto';
    document.getElementById('btn-cancel-project').style.display = 'none';
}

// --- SERVICIOS PÚBLICOS LOGIC ---
async function loadServices() {
    const servicios = await getServicios();
    servicesTbody.innerHTML = '';

    servicios.forEach(servicio => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${servicio.id}</td>
            <td>${servicio.tipo}</td>
            <td>${servicio.descripcion}</td>
            <td>${servicio.responsable}</td>
            <td>${servicio.estado}</td>
            <td>
                <button class="btn-edit-service" data-id="${servicio.id}" style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer;">Editar</button>
                <button class="btn-delete-service" data-id="${servicio.id}" style="background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Eliminar</button>
            </td>
        `;
        servicesTbody.appendChild(tr);
    });

    document.querySelectorAll('.btn-edit-service').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            const service = servicios.find(s => s.id === id);
            if (service) {
                document.getElementById('service-id').value = service.id;
                document.getElementById('service-type').value = service.tipo;
                document.getElementById('service-responsible').value = service.responsable;
                document.getElementById('service-status').value = service.estado;
                document.getElementById('service-desc').value = service.descripcion;

                document.getElementById('service-form-title').textContent = 'Editar Servicio Público';
                document.getElementById('btn-cancel-service').style.display = 'inline-block';
            }
        });
    });

    document.querySelectorAll('.btn-delete-service').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Eliminar servicio?')) {
                await deleteServicio(id);
                loadServices();
            }
        });
    });
}

serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('service-id').value;
    const tipo = document.getElementById('service-type').value;
    const responsable = document.getElementById('service-responsible').value.trim();
    const estado = document.getElementById('service-status').value.trim();
    const descripcion = document.getElementById('service-desc').value.trim();

    if (responsable === "" || estado === "" || descripcion === "") {
        alert("Por favor, complete todos los campos del servicio.");
        return;
    }

    const data = {
        tipo,
        responsable,
        estado,
        descripcion
    };

    let res;
    if (id) {
        res = await updateServicio(id, data);
    } else {
        res = await createServicio(data);
    }

    if (res) {
        alert(id ? 'Servicio actualizado' : 'Servicio creado');
        resetServiceForm();
        loadServices();
    } else {
        alert('Error al guardar servicio');
    }
});

document.getElementById('btn-cancel-service').addEventListener('click', resetServiceForm);

function resetServiceForm() {
    serviceForm.reset();
    document.getElementById('service-id').value = '';
    document.getElementById('service-form-title').textContent = 'Gestionar Servicio Público';
    document.getElementById('btn-cancel-service').style.display = 'none';
}
