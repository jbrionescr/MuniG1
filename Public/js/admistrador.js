import {
    getReportes, updateReporteStatus, deleteReporte,
    getProyectos, createProyecto, updateProyecto, deleteProyecto,
    getServicios, createServicio, updateServicio, deleteServicio,
    getFinanciamientos, postFinanciamientos, updateFinanciamiento, deleteFinanciamiento,
    getdata, updateUserRole, deleteUser,
    getPlanilla, createPlanilla, updatePlanilla, deletePlanilla
} from '../services/serviceUsuarios.js';

const btnSalir = document.getElementById("btnSalir")

if (btnSalir) {
    btnSalir.addEventListener("click", () => {
        window.location.href = "/html/index.html"
    })
}

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
    const sections = ['reportes', 'proyectos', 'servicios', 'financiamientos', 'usuarios', 'planilla'];

    sections.forEach(sec => {
        const el = document.getElementById(`${sec}-section`);
        if (el) el.style.display = sec === section ? 'block' : 'none';
    });

    if (section === 'usuarios') {
        loadUsers();
    } else if (section === 'planilla') {
        loadPlanilla();
    } else if (section === 'proyectos') {
        loadProjects();
    } else if (section === 'servicios') {
        loadServices();
    } else if (section === 'financiamientos') {
        loadFinancings();
    }
}

/* =======================
   REPORTES
======================= */

async function loadReports() {
    const reportes = await getReportes();
    const tbody = document.getElementById('reports-tbody');
    if (!tbody) return;
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
    if (!tbody) return;
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
   PLANILLA
======================= */

async function loadPlanilla() {
    const planilla = await getPlanilla();
    const tbody = document.getElementById('planilla-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    planilla.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.fecha}</td>
                <td>${p.nombre}</td>
                <td>${p.puesto}</td>
                <td>${p.salarioNeto}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editPlanilla('${p.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlanillaAction('${p.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Cálculo automático de salario neto
const formPlanilla = document.getElementById('planilla-form');
const grossInput = document.getElementById('planilla-salario-bruto');
const extraInput = document.getElementById('planilla-horas-extras');
const deductionsInput = document.getElementById('planilla-rebajos');
const netInput = document.getElementById('planilla-salario-neto');
const montohorasInput = document.getElementById('planilla-monto-horas-extras');

function calculateNet() {
    const gross = parseFloat(grossInput.value) || 0;
    const extraHours = parseFloat(extraInput.value) || 0;
    const extraAmount = extraHours * 1000;
    const deductions = parseFloat(deductionsInput.value) || 0;

    montohorasInput.value = extraAmount.toFixed(2);
    netInput.value = (gross + extraAmount - deductions).toFixed(2);
}

if (grossInput) {
    [grossInput, extraInput, deductionsInput].forEach(input => {
        input.addEventListener('input', calculateNet);
    });
}

if (formPlanilla) {
    formPlanilla.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('planilla-id').value;
        const data = {
            nombre: document.getElementById('planilla-nombre').value,
            puesto: document.getElementById('planilla-puesto').value,
            departamento: document.getElementById('planilla-departamento').value,
            fecha: document.getElementById('planilla-fecha').value,
            salarioBruto: parseFloat(grossInput.value),
            horasExtras: parseFloat(extraInput.value) || 0,
            montoHorasExtras: parseFloat(montohorasInput.value),
            rebajos: parseFloat(deductionsInput.value),
            salarioNeto: parseFloat(netInput.value)
        };

        if (id) {
            await updatePlanilla(id, data);
        } else {
            await createPlanilla(data);
        }

        resetPlanillaForm();
        loadPlanilla();
    });
}

window.editPlanilla = async (id) => {
    const records = await getPlanilla();
    const p = records.find(rec => rec.id == id);
    if (p) {
        document.getElementById('planilla-id').value = p.id;
        document.getElementById('planilla-nombre').value = p.nombre;
        document.getElementById('planilla-puesto').value = p.puesto;
        document.getElementById('planilla-departamento').value = p.departamento;
        document.getElementById('planilla-fecha').value = p.fecha;
        grossInput.value = p.salarioBruto;
        extraInput.value = p.horasExtras || 0;
        montohorasInput.value = (p.horasExtras * 1000) || 0;
        deductionsInput.value = p.rebajos;
        netInput.value = p.salarioNeto;

        const btnCancel = document.getElementById('btn-cancel-planilla');
        if (btnCancel) btnCancel.style.display = 'inline-block';
    }
};

const btnCancelPlanilla = document.getElementById('btn-cancel-planilla');
if (btnCancelPlanilla) {
    btnCancelPlanilla.addEventListener('click', resetPlanillaForm);
}

function resetPlanillaForm() {
    if (formPlanilla) formPlanilla.reset();
    document.getElementById('planilla-id').value = '';
    const btnCancel = document.getElementById('btn-cancel-planilla');
    if (btnCancel) btnCancel.style.display = 'none';
}

window.deletePlanillaAction = async (id) => {
    if (confirm('¿Deseas eliminar este registro de planilla?')) {
        await deletePlanilla(id);
        loadPlanilla();
    }
};

/* =======================
   PROYECTOS
======================= */

async function loadProjects() {
    const proyectos = await getProyectos();
    const tbody = document.getElementById('projects-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    proyectos.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.presupuesto}</td>
                <td>${p.estado}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProject('${p.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProjectAction('${p.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

const formProject = document.getElementById('project-form');
if (formProject) {
    formProject.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('project-id').value;
        const data = {
            nombre: document.getElementById('project-name').value,
            presupuesto: parseFloat(document.getElementById('project-budget').value),
            fecha: document.getElementById('project-date').value,
            estado: document.getElementById('project-status').value,
            descripcion: document.getElementById('project-desc').value
        };

        if (id) {
            await updateProyecto(id, data);
        } else {
            await createProyecto(data);
        }

        resetProjectForm();
        loadProjects();
    });
}

window.editProject = async (id) => {
    const list = await getProyectos();
    const p = list.find(item => item.id == id);
    if (p) {
        document.getElementById('project-id').value = p.id;
        document.getElementById('project-name').value = p.nombre;
        document.getElementById('project-budget').value = p.presupuesto;
        document.getElementById('project-date').value = p.fecha;
        document.getElementById('project-status').value = p.estado;
        document.getElementById('project-desc').value = p.descripcion;

        const btnCancel = document.getElementById('btn-cancel-project');
        if (btnCancel) btnCancel.style.display = 'inline-block';
    }
};

const btnCancelProject = document.getElementById('btn-cancel-project');
if (btnCancelProject) {
    btnCancelProject.addEventListener('click', resetProjectForm);
}

function resetProjectForm() {
    if (formProject) formProject.reset();
    document.getElementById('project-id').value = '';
    const btnCancel = document.getElementById('btn-cancel-project');
    if (btnCancel) btnCancel.style.display = 'none';
}

window.deleteProjectAction = async (id) => {
    if (confirm('¿Deseas eliminar este proyecto?')) {
        await deleteProyecto(id);
        loadProjects();
    }
};

/* =======================
   SERVICIOS
======================= */

async function loadServices() {
    const servicios = await getServicios();
    const tbody = document.getElementById('services-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    servicios.forEach(s => {
        tbody.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.tipo}</td>
                <td>${s.responsable}</td>
                <td>${s.estado}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editService('${s.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteServiceAction('${s.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

const formService = document.getElementById('service-form');
if (formService) {
    formService.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('service-id').value;
        const data = {
            tipo: document.getElementById('service-type').value,
            responsable: document.getElementById('service-responsible').value,
            estado: document.getElementById('service-status').value,
            descripcion: document.getElementById('service-desc').value
        };

        if (id) {
            await updateServicio(id, data);
        } else {
            await createServicio(data);
        }

        resetServiceForm();
        loadServices();
    });
}

window.editService = async (id) => {
    const list = await getServicios();
    const s = list.find(item => item.id == id);
    if (s) {
        document.getElementById('service-id').value = s.id;
        document.getElementById('service-type').value = s.tipo;
        document.getElementById('service-responsible').value = s.responsable;
        document.getElementById('service-status').value = s.estado;
        document.getElementById('service-desc').value = s.descripcion;

        const btnCancel = document.getElementById('btn-cancel-service');
        if (btnCancel) btnCancel.style.display = 'inline-block';
    }
};

const btnCancelService = document.getElementById('btn-cancel-service');
if (btnCancelService) {
    btnCancelService.addEventListener('click', resetServiceForm);
}

function resetServiceForm() {
    if (formService) formService.reset();
    document.getElementById('service-id').value = '';
    const btnCancel = document.getElementById('btn-cancel-service');
    if (btnCancel) btnCancel.style.display = 'none';
}

window.deleteServiceAction = async (id) => {
    if (confirm('¿Deseas eliminar este servicio?')) {
        await deleteServicio(id);
        loadServices();
    }
};

/* =======================
   FINANCIAMIENTOS
======================= */

async function loadFinancings() {
    const financiamientos = await getFinanciamientos();
    const tbody = document.getElementById('financing-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    financiamientos.forEach(f => {
        tbody.innerHTML += `
            <tr>
                <td>${f.id}</td>
                <td>${f.proyecto}</td>
                <td>${f.monto}</td>
                <td>${f.estado}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editFinancing('${f.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFinancingAction('${f.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

const formFinancing = document.getElementById('financing-form');
if (formFinancing) {
    formFinancing.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('financing-id').value;
        const data = {
            proyecto: document.getElementById('financing-project').value,
            tipo: document.getElementById('financing-type').value,
            monto: parseFloat(document.getElementById('financing-amount').value),
            fuente: document.getElementById('financing-source').value,
            fecha: document.getElementById('financing-date').value,
            estado: document.getElementById('financing-status').value,
            descripcion: document.getElementById('financing-desc').value
        };

        if (id) {
            await updateFinanciamiento(id, data);
        } else {
            await postFinanciamientos(data);
        }

        resetFinancingForm();
        loadFinancings();
    });
}

window.editFinancing = async (id) => {
    const list = await getFinanciamientos();
    const f = list.find(item => item.id == id);
    if (f) {
        document.getElementById('financing-id').value = f.id;
        document.getElementById('financing-project').value = f.proyecto;
        document.getElementById('financing-type').value = f.tipo;
        document.getElementById('financing-amount').value = f.monto;
        document.getElementById('financing-source').value = f.fuente;
        document.getElementById('financing-date').value = f.fecha;
        document.getElementById('financing-status').value = f.estado;
        document.getElementById('financing-desc').value = f.descripcion;

        const btnCancel = document.getElementById('btn-cancel-financing');
        if (btnCancel) btnCancel.style.display = 'inline-block';
    }
};

const btnCancelFinancing = document.getElementById('btn-cancel-financing');
if (btnCancelFinancing) {
    btnCancelFinancing.addEventListener('click', resetFinancingForm);
}

function resetFinancingForm() {
    if (formFinancing) formFinancing.reset();
    document.getElementById('financing-id').value = '';
    const btnCancel = document.getElementById('btn-cancel-financing');
    if (btnCancel) btnCancel.style.display = 'none';
}

window.deleteFinancingAction = async (id) => {
    if (confirm('¿Deseas eliminar este financiamiento?')) {
        await deleteFinanciamiento(id);
        loadFinancings();
    }
};

/* =======================
   INICIALIZAR
======================= */

loadReports();

