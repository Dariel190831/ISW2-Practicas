// ========================================
// SISTEMA DE CITAS MÉDICAS - APP.JS
// ========================================

// ========================================
// VARIABLES GLOBALES
// ========================================
let currentUser = null;
let appointmentFilter = 'all';

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Cargar usuario de sesión
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        currentUser = user;
        showApp();
    } else {
        showLogin();
    }

    // Inicializar datos si no existen
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify([]));
    }
    if (!localStorage.getItem('doctors')) {
        localStorage.setItem('doctors', JSON.stringify(initializeSampleDoctors()));
    }
}

function setupEventListeners() {
    // Cambio de rol en registro
    document.querySelectorAll('input[name="regRole"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const doctorFields = document.getElementById('doctorFields');
            doctorFields.style.display = this.value === 'medico' ? 'block' : 'none';
        });
    });
}

// ========================================
// AUTENTICACIÓN
// ========================================
function login() {
    const role = document.querySelector('input[name="role"]:checked').value;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast(`¡Bienvenido ${user.name}!`);
        showApp();
    } else {
        showToast('Credenciales inválidas', 'error');
    }
}

function register() {
    const role = document.querySelector('input[name="regRole"]:checked').value;
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const phone = document.getElementById('regPhone').value.trim();

    if (!name || !email || !password || !phone) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    
    if (users.find(u => u.email === email)) {
        showToast('El correo ya está registrado', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        role,
        createdAt: new Date().toISOString()
    };

    if (role === 'medico') {
        const specialty = document.getElementById('regSpecialty').value.trim();
        const license = document.getElementById('regLicense').value.trim();
        newUser.specialty = specialty;
        newUser.license = license;

        const doctors = JSON.parse(localStorage.getItem('doctors')) || [];
        doctors.push({
            id: newUser.id,
            name,
            email,
            phone,
            specialty,
            license,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('doctors', JSON.stringify(doctors));
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showToast('Registro exitoso. Por favor, inicia sesión');
    showLogin();
    clearRegisterForm();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
    clearLoginForm();
}

function showLogin() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('registerModal').classList.remove('active');
    document.getElementById('app').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('registerModal').classList.add('active');
}

function clearLoginForm() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function clearRegisterForm() {
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regSpecialty').value = '';
    document.getElementById('regLicense').value = '';
}

// ========================================
// INTERFAZ DE USUARIO
// ========================================
function showApp() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('registerModal').classList.remove('active');
    document.getElementById('app').style.display = 'block';
    updateUI();
}

function updateUI() {
    // Mostrar información del usuario
    document.getElementById('userDisplay').textContent = `${currentUser.name} (${currentUser.role})`;

    // Mostrar/ocultar opciones según rol
    const isPaciente = currentUser.role === 'paciente';
    document.getElementById('patientsNavBtn').style.display = isPaciente ? 'none' : 'block';
    document.getElementById('doctorsNavBtn').style.display = isPaciente ? 'none' : 'block';
    document.getElementById('patientsCard').style.display = isPaciente ? 'none' : 'block';
    document.getElementById('doctorsCard').style.display = isPaciente ? 'none' : 'block';

    // Mostrar sección de dashboard
    showSection('dashboard');
    updateDashboard();
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar sección solicitada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');

        // Cargar datos según sección
        if (sectionId === 'appointments') {
            loadAppointments();
        } else if (sectionId === 'patients') {
            loadPatients();
        } else if (sectionId === 'doctors') {
            loadDoctors();
        } else if (sectionId === 'history') {
            loadHistory();
        } else if (sectionId === 'newAppointment') {
            loadDoctorsForAppointment();
        }
    }
}

// ========================================
// DASHBOARD
// ========================================
function updateDashboard() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const now = new Date();

    let upcomingCount = 0;
    let completedCount = 0;

    appointments.forEach(apt => {
        if (isUserAppointment(apt)) {
            const aptDate = new Date(apt.date + 'T' + apt.time);
            if (aptDate > now && apt.status !== 'cancelled') {
                upcomingCount++;
            } else if (apt.status === 'completed') {
                completedCount++;
            }
        }
    });

    document.getElementById('upcomingCount').textContent = upcomingCount;
    document.getElementById('completedCount').textContent = completedCount;

    if (currentUser.role !== 'paciente') {
        const users = JSON.parse(localStorage.getItem('users'));
        const patients = users.filter(u => u.role === 'paciente');
        document.getElementById('patientsCount').textContent = patients.length;

        const doctors = JSON.parse(localStorage.getItem('doctors'));
        document.getElementById('doctorsCount').textContent = doctors.length;
    }
}

// ========================================
// GESTIÓN DE CITAS
// ========================================
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const doctors = JSON.parse(localStorage.getItem('doctors'));
    const users = JSON.parse(localStorage.getItem('users'));
    
    let filtered = appointments.filter(apt => isUserAppointment(apt));

    if (appointmentFilter === 'upcoming') {
        const now = new Date();
        filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.date + 'T' + apt.time);
            return aptDate > now && apt.status !== 'cancelled';
        });
    } else if (appointmentFilter === 'past') {
        const now = new Date();
        filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.date + 'T' + apt.time);
            return aptDate <= now || apt.status === 'cancelled';
        });
    }

    const container = document.getElementById('appointmentsList');
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No hay citas para mostrar</p>';
        return;
    }

    container.innerHTML = filtered.map(apt => {
        const doctor = doctors.find(d => d.id === apt.doctorId);
        const patient = users.find(u => u.id === apt.patientId);
        const aptDate = new Date(apt.date + 'T' + apt.time);
        const isPast = aptDate < new Date();

        return `
            <div class="appointment-card ${isPast ? 'past' : ''} ${apt.status === 'cancelled' ? 'cancelled' : ''}">
                <h4>${doctor ? doctor.name : 'Médico desconocido'}</h4>
                <p><span class="label">Especialidad:</span> ${doctor ? doctor.specialty : 'N/A'}</p>
                <p><span class="label">Fecha:</span> ${formatDate(apt.date)}</p>
                <p><span class="label">Hora:</span> ${apt.time}</p>
                <p><span class="label">Motivo:</span> ${apt.reason}</p>
                ${patient ? `<p><span class="label">Paciente:</span> ${patient.name}</p>` : ''}
                <span class="status ${apt.status}">${capitalizeStatus(apt.status)}</span>
                ${apt.notes ? `<div class="notes"><strong>Notas:</strong> ${apt.notes}</div>` : ''}
                
                <div class="appointment-actions">
                    ${apt.status === 'pending' && currentUser.role === 'paciente' ? `
                        <button class="btn btn-small btn-danger" onclick="cancelAppointment(${apt.id})">Cancelar</button>
                    ` : ''}
                    ${apt.status === 'pending' && currentUser.role !== 'paciente' ? `
                        <button class="btn btn-small btn-success" onclick="confirmAppointment(${apt.id})">Confirmar</button>
                        <button class="btn btn-small btn-warning" onclick="showAddNotes(${apt.id})">Añadir Notas</button>
                        <button class="btn btn-small btn-danger" onclick="cancelAppointment(${apt.id})">Rechazar</button>
                    ` : ''}
                    ${apt.status === 'confirmed' && currentUser.role !== 'paciente' && !isPast ? `
                        <button class="btn btn-small btn-success" onclick="completeAppointment(${apt.id})">Marcar como Completada</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function loadDoctorsForAppointment() {
    const doctors = JSON.parse(localStorage.getItem('doctors'));
    const select = document.getElementById('appointmentDoctor');
    
    select.innerHTML = '<option value="">Seleccionar médico...</option>' + 
        doctors.map(doctor => `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty}</option>`).join('');
}

function saveAppointment() {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const doctorId = parseInt(document.getElementById('appointmentDoctor').value);
    const reason = document.getElementById('appointmentReason').value.trim();

    if (!date || !time || !doctorId || !reason) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }

    const appointments = JSON.parse(localStorage.getItem('appointments'));
    
    const appointment = {
        id: Date.now(),
        patientId: currentUser.id,
        doctorId: doctorId,
        date: date,
        time: time,
        reason: reason,
        status: 'pending',
        notes: '',
        createdAt: new Date().toISOString()
    };

    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    showToast('¡Cita agendada exitosamente!');
    clearAppointmentForm();
    showSection('appointments');
}

function confirmAppointment(appointmentId) {
    updateAppointmentStatus(appointmentId, 'confirmed');
}

function completeAppointment(appointmentId) {
    updateAppointmentStatus(appointmentId, 'completed');
}

function cancelAppointment(appointmentId) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
        updateAppointmentStatus(appointmentId, 'cancelled');
    }
}

function updateAppointmentStatus(appointmentId, status) {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (appointment) {
        appointment.status = status;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
        showToast('Cita actualizada');
    }
}

function showAddNotes(appointmentId) {
    const notes = prompt('Añadir notas a la cita:');
    if (notes !== null) {
        const appointments = JSON.parse(localStorage.getItem('appointments'));
        const appointment = appointments.find(a => a.id === appointmentId);
        if (appointment) {
            appointment.notes = notes;
            localStorage.setItem('appointments', JSON.stringify(appointments));
            loadAppointments();
            showToast('Notas añadidas');
        }
    }
}

function filterAppointments(filter) {
    appointmentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadAppointments();
}

function clearAppointmentForm() {
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('appointmentDoctor').value = '';
    document.getElementById('appointmentReason').value = '';
}

// ========================================
// GESTIÓN DE PACIENTES
// ========================================
function loadPatients() {
    const users = JSON.parse(localStorage.getItem('users'));
    const patients = users.filter(u => u.role === 'paciente');
    const appointments = JSON.parse(localStorage.getItem('appointments'));

    const container = document.getElementById('patientsList');
    
    if (patients.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">No hay pacientes registrados</p>';
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Citas Totales</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => {
                    const patientApts = appointments.filter(a => a.patientId === patient.id);
                    return `
                        <tr>
                            <td>${patient.name}</td>
                            <td>${patient.email}</td>
                            <td>${patient.phone}</td>
                            <td>${patientApts.length}</td>
                            <td>
                                <button class="btn btn-small btn-info" onclick="viewPatientHistory(${patient.id})">Ver Historial</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    
    const patients = users.filter(u => 
        u.role === 'paciente' && (
            u.name.toLowerCase().includes(searchTerm) ||
            u.email.toLowerCase().includes(searchTerm) ||
            u.phone.includes(searchTerm)
        )
    );

    const container = document.getElementById('patientsList');
    
    if (patients.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">No se encontraron pacientes</p>';
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Citas Totales</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${patients.map(patient => {
                    const patientApts = appointments.filter(a => a.patientId === patient.id);
                    return `
                        <tr>
                            <td>${patient.name}</td>
                            <td>${patient.email}</td>
                            <td>${patient.phone}</td>
                            <td>${patientApts.length}</td>
                            <td>
                                <button class="btn btn-small btn-info" onclick="viewPatientHistory(${patient.id})">Ver Historial</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

// ========================================
// GESTIÓN DE MÉDICOS
// ========================================
function loadDoctors() {
    const doctors = JSON.parse(localStorage.getItem('doctors'));
    const appointments = JSON.parse(localStorage.getItem('appointments'));

    const container = document.getElementById('doctorsList');
    
    if (doctors.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center;">No hay médicos registrados</p>';
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Teléfono</th>
                    <th>Citas Totales</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${doctors.map(doctor => {
                    const doctorApts = appointments.filter(a => a.doctorId === doctor.id);
                    return `
                        <tr>
                            <td>${doctor.name}</td>
                            <td>${doctor.specialty}</td>
                            <td>${doctor.phone}</td>
                            <td>${doctorApts.length}</td>
                            <td>
                                <button class="btn btn-small btn-danger" onclick="deleteDoctor(${doctor.id})">Eliminar</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function saveDoctor() {
    const name = document.getElementById('doctorName').value.trim();
    const email = document.getElementById('doctorEmail').value.trim();
    const phone = document.getElementById('doctorPhone').value.trim();
    const specialty = document.getElementById('doctorSpecialty').value.trim();
    const license = document.getElementById('doctorLicense').value.trim();

    if (!name || !email || !phone || !specialty || !license) {
        showToast('Por favor, completa todos los campos', 'error');
        return;
    }

    const doctors = JSON.parse(localStorage.getItem('doctors'));
    
    const newDoctor = {
        id: Date.now(),
        name,
        email,
        phone,
        specialty,
        license,
        createdAt: new Date().toISOString()
    };

    doctors.push(newDoctor);
    localStorage.setItem('doctors', JSON.stringify(doctors));

    showToast('Médico agregado exitosamente');
    clearDoctorForm();
    showSection('doctors');
}

function deleteDoctor(doctorId) {
    if (confirm('¿Estás seguro de que deseas eliminar este médico?')) {
        const doctors = JSON.parse(localStorage.getItem('doctors'));
        const filtered = doctors.filter(d => d.id !== doctorId);
        localStorage.setItem('doctors', JSON.stringify(filtered));
        loadDoctors();
        showToast('Médico eliminado');
    }
}

function clearDoctorForm() {
    document.getElementById('doctorName').value = '';
    document.getElementById('doctorEmail').value = '';
    document.getElementById('doctorPhone').value = '';
    document.getElementById('doctorSpecialty').value = '';
    document.getElementById('doctorLicense').value = '';
}

// ========================================
// HISTORIAL MÉDICO
// ========================================
function loadHistory() {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const doctors = JSON.parse(localStorage.getItem('doctors'));
    const users = JSON.parse(localStorage.getItem('users'));
    
    let historyApts = appointments.filter(apt => isUserAppointment(apt));
    historyApts = historyApts.filter(apt => apt.status === 'completed');
    historyApts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById('historyList');
    
    if (historyApts.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No hay historial de citas</p>';
        return;
    }

    container.innerHTML = historyApts.map(apt => {
        const doctor = doctors.find(d => d.id === apt.doctorId);
        const patient = users.find(u => u.id === apt.patientId);

        return `
            <div class="history-item">
                <h4>${doctor ? doctor.name : 'Médico desconocido'}</h4>
                <p><span class="label">Especialidad:</span> ${doctor ? doctor.specialty : 'N/A'}</p>
                <p><span class="label">Fecha:</span> ${formatDate(apt.date)}</p>
                <p><span class="label">Hora:</span> ${apt.time}</p>
                <p><span class="label">Motivo de la Consulta:</span> ${apt.reason}</p>
                ${patient ? `<p><span class="label">Paciente:</span> ${patient.name}</p>` : ''}
                ${apt.notes ? `<div class="notes"><strong>Notas del Médico:</strong> ${apt.notes}</div>` : ''}
            </div>
        `;
    }).join('');
}

function viewPatientHistory(patientId) {
    const appointments = JSON.parse(localStorage.getItem('appointments'));
    const doctors = JSON.parse(localStorage.getItem('doctors'));
    
    const patientApts = appointments.filter(apt => apt.patientId === patientId && apt.status === 'completed');
    
    if (patientApts.length === 0) {
        showToast('Este paciente no tiene historial de citas completadas', 'info');
        return;
    }

    alert(`Historial del paciente:\n\n${patientApts.map(apt => {
        const doctor = doctors.find(d => d.id === apt.doctorId);
        return `• ${formatDate(apt.date)} - ${doctor ? doctor.name : 'N/A'}\n  ${apt.reason}\n  ${apt.notes ? 'Notas: ' + apt.notes : ''}`;
    }).join('\n\n')}`);
}

// ========================================
// UTILIDADES
// ========================================
function isUserAppointment(appointment) {
    if (currentUser.role === 'paciente') {
        return appointment.patientId === currentUser.id;
    } else {
        return appointment.doctorId === currentUser.id;
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function capitalizeStatus(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'confirmed': 'Confirmada',
        'completed': 'Completada',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function initializeSampleDoctors() {
    return [
        {
            id: 1001,
            name: 'Dr. Juan García',
            email: 'juan.garcia@hospital.com',
            phone: '555-0101',
            specialty: 'Cardiología',
            license: 'MED-001'
        },
        {
            id: 1002,
            name: 'Dra. María López',
            email: 'maria.lopez@hospital.com',
            phone: '555-0102',
            specialty: 'Pediatría',
            license: 'MED-002'
        },
        {
            id: 1003,
            name: 'Dr. Carlos Rodríguez',
            email: 'carlos.rodriguez@hospital.com',
            phone: '555-0103',
            specialty: 'Dermatología',
            license: 'MED-003'
        },
        {
            id: 1004,
            name: 'Dra. Ana Martínez',
            email: 'ana.martinez@hospital.com',
            phone: '555-0104',
            specialty: 'Oftalmología',
            license: 'MED-004'
        },
        {
            id: 1005,
            name: 'Dr. Luis Fernández',
            email: 'luis.fernandez@hospital.com',
            phone: '555-0105',
            specialty: 'Traumatología',
            license: 'MED-005'
        }
    ];
}
