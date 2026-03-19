<template>
  <div class="dashboard-wrapper">
    <header class="navbar">
      <div class="nav-brand">🩺 Clínica Digital</div>
      <div class="nav-user">
        <span class="badge">{{ user.role?.toUpperCase() }}</span>
        <span class="nav-text">Olá, <strong>{{ user.name }}</strong></span>
        <button @click="logout" class="btn-logout">Sair</button>
      </div>
    </header>

    <main class="main-container">
      
      <div v-if="user.role === 'master'" class="master-layout">
        <div class="grid-3-cols">
          <section class="card shadow border-blue">
            <h3>🔑 Novo Administrador</h3>
            <p class="subtitle">Acesso de gestão do sistema</p>
            <form @submit.prevent="registerAdmin" class="form-stack">
              <input v-model="newAdmin.name" placeholder="Nome Completo" required />
              <input v-model="newAdmin.email" type="email" placeholder="E-mail" required />
              <input v-model="newAdmin.phone" placeholder="Telefone" @input="formatPhoneAdmin" maxlength="15" required />
              <input v-model="newAdmin.password" type="password" placeholder="Senha" required />
              <button type="submit" class="btn-primary">Criar Administrador</button>
            </form>
          </section>

          <section class="card shadow border-blue">
            <h3>👤 Novo Paciente</h3>
            <p class="subtitle">Cadastro completo com endereço</p>
            <form @submit.prevent="registerUser" class="form-stack">
              <input v-model="newUser.name" placeholder="Nome Completo" required />
              <input v-model="newUser.email" type="email" placeholder="E-mail" required />
              <input v-model="newUser.phone" placeholder="Telefone" @input="formatPhone" maxlength="15" required />
              <input v-model="newUser.cep" placeholder="CEP" @blur="buscarCep" maxlength="8" required />
              <input v-model="newUser.logradouro" placeholder="Logradouro" readonly class="input-readonly" />
              <div class="form-row-custom">
                <input v-model="newUser.bairro" placeholder="Bairro" readonly class="input-readonly" />
                <input v-model="newUser.numero" placeholder="Nº" required style="width: 70px;" />
              </div>
              <div class="form-row-custom">
                <input v-model="newUser.cidade" placeholder="Cidade" readonly class="input-readonly" />
                <input v-model="newUser.estado" placeholder="UF" readonly class="input-readonly" style="width: 50px;" />
              </div>
              <input v-model="newUser.complemento" placeholder="Complemento" />
              <input v-model="newUser.password" type="password" placeholder="Senha" required />
              <button type="submit" class="btn-primary">Registrar Paciente</button>
            </form>
          </section>

          <section class="card shadow border-green">
            <h3>👨‍⚕️ Novo Médico</h3>
            <p class="subtitle">Acesso profissional de saúde</p>
            <form @submit.prevent="saveDoctor" class="form-stack">
              <input v-model="newDoctor.name" placeholder="Nome do Médico" required />
              <input v-model="newDoctor.specialty" placeholder="Especialidade" required />
              <input v-model="newDoctor.phone" placeholder="Telefone" @input="formatPhoneDoctor" maxlength="15" required />
              <input v-model="newDoctor.email" type="email" placeholder="E-mail Profissional" required />
              <input v-model="newDoctor.password" type="password" placeholder="Senha" required />
              <button type="submit" class="btn-success">Salvar Médico</button>
            </form>
          </section>
        </div>
      </div>

      <div v-if="user.role === 'admin'" class="layout-admin">
        <aside class="sidebar">
          <section class="card shadow mb-20">
            <h3>👨‍⚕️ Cadastrar Médico</h3>
            <form @submit.prevent="saveDoctor" class="form-stack">
              <input v-model="newDoctor.name" placeholder="Nome" required />
              <input v-model="newDoctor.specialty" placeholder="Especialidade" required />
              <input v-model="newDoctor.phone" placeholder="Telefone" @input="formatPhoneDoctor" maxlength="15" required />
              <input v-model="newDoctor.email" type="email" placeholder="E-mail" required />
              <input v-model="newDoctor.password" type="password" placeholder="Senha" required />
              <button type="submit" class="btn-success-sm">Salvar Médico</button>
            </form>
          </section>
          </aside>

        <section class="card shadow main-panel">
           <div class="header-row">
             <h3 style="margin: 0;">Gestão de Consultas</h3>
             <button @click="showNovaConsulta = !showNovaConsulta" class="btn-primary-sm">
               {{ showNovaConsulta ? 'Fechar Formulário' : '+ Nova Consulta' }}
             </button>
           </div>
           </section>
      </div>

      </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api'; // Ajuste o caminho se a sua importação da API for diferente
import { useRouter } from 'vue-router';

const router = useRouter();

// ==========================================
// ESTADOS (VARIÁVEIS)
// ==========================================
const user = ref(JSON.parse(localStorage.getItem('user')) || {});
const patients = ref([]);
const doctors = ref([]);
const appointments = ref([]);
const lista = ref([]); // Caso use para listagens genéricas no dashboard

// Controles de Tela
const showNovaConsulta = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

// Filtros
const filterPatient = ref('');
const filterDoctor = ref('');

// Data mínima para agendamento (Amanhã ou Hoje)
const tomorrow = new Date().toISOString().split('T')[0];

// Formulários
const form = ref({ patientId: '', doctorName: '', date: '', time: '' });
const newAdmin = ref({ name: '', email: '', phone: '', password: '', role: 'master' });
const newUser = ref({ name: '', email: '', phone: '', cep: '', logradouro: '', bairro: '', numero: '', cidade: '', estado: '', complemento: '', password: '', role: 'paciente' });
const newDoctor = ref({ name: '', specialty: '', phone: '', email: '', password: '', role: 'medico' });

// ==========================================
// FUNÇÕES COMPUTADAS (FILTROS)
// ==========================================
const filteredApps = computed(() => {
  return appointments.value.filter(app => {
    const patientMatch = filterPatient.value ? getPatientName(app.patientId) === filterPatient.value : true;
    const doctorMatch = filterDoctor.value ? app.doctorName === filterDoctor.value : true;
    return patientMatch && doctorMatch;
  });
});

// ==========================================
// MÉTODOS DE BUSCA E FORMATAÇÃO
// ==========================================
const loadData = async () => {
  try {
    const [pts, docs, apps] = await Promise.all([
      api.get('/users/pacientes'), // Ajuste a rota se necessário
      api.get('/doctors'),
      api.get('/agendamentos')
    ]);
    patients.value = pts.data;
    doctors.value = docs.data;
    appointments.value = apps.data;
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
};

const buscarCep = async () => {
  if (newUser.value.cep.length === 8) {
    try {
      const res = await api.get(`https://viacep.com.br/ws/${newUser.value.cep}/json/`);
      if (!res.data.erro) {
        newUser.value.logradouro = res.data.logradouro;
        newUser.value.bairro = res.data.bairro;
        newUser.value.cidade = res.data.localidade;
        newUser.value.estado = res.data.uf;
      }
    } catch (err) {
      alert("Erro ao buscar o CEP.");
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const getPatientName = (patient) => patient?.name || 'Desconhecido';
const getPatientPhone = (patient) => patient?.phone || 'Sem contato';
const getSpecialty = (docName) => {
  const doctor = doctors.value.find(d => d.name === docName);
  return doctor ? doctor.specialty : 'Clínico Geral';
};

// Máscaras (Simplificadas)
const formatPhone = (e) => newUser.value.phone = e.target.value.replace(/\D/g, '');
const formatPhoneAdmin = (e) => newAdmin.value.phone = e.target.value.replace(/\D/g, '');
const formatPhoneDoctor = (e) => newDoctor.value.phone = e.target.value.replace(/\D/g, '');

// ==========================================
// AÇÕES (CRUD)
// ==========================================
const saveAppointment = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/agendamentos/${editingId.value}`, form.value);
    } else {
      await api.post('/agendamentos', form.value);
    }
    alert("Consulta salva com sucesso!");
    cancelEdit();
    loadData();
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Erro ao salvar agendamento.";
    alert(errorMsg);
  }
};

const editApp = (app) => {
  isEditing.value = true;
  editingId.value = app._id;
  form.value = {
    patientId: app.patientId?._id || app.patientId,
    doctorName: app.doctorName,
    date: app.date,
    time: app.time
  };
  showNovaConsulta.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { patientId: '', doctorName: '', date: '', time: '' };
  showNovaConsulta.value = false;
};

const deleteApp = async (id) => {
  if (confirm("Tem certeza que deseja desmarcar esta consulta?")) {
    try {
      await api.delete(`/agendamentos/${id}`);
      loadData();
    } catch (err) {
      alert("Erro ao deletar consulta.");
    }
  }
};

const registerAdmin = async () => {
  try {
    await api.post('/users/register', newAdmin.value);
    alert("Administrador criado!");
    newAdmin.value = { name: '', email: '', phone: '', password: '', role: 'master' };
  } catch (err) { alert("Erro ao criar admin."); }
};

const registerUser = async () => {
  try {
    await api.post('/users/register', newUser.value);
    alert("Paciente cadastrado!");
    newUser.value = { name: '', email: '', phone: '', cep: '', logradouro: '', bairro: '', numero: '', cidade: '', estado: '', complemento: '', password: '', role: 'paciente' };
    loadData();
  } catch (err) { alert("Erro ao cadastrar paciente."); }
};

const saveDoctor = async () => {
  try {
    await api.post('/doctors', newDoctor.value);
    alert("Médico cadastrado!");
    newDoctor.value = { name: '', specialty: '', phone: '', email: '', password: '', role: 'medico' };
    loadData();
  } catch (err) { alert("Erro ao cadastrar médico."); }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  router.push('/login');
};

// ==========================================
// INICIALIZAÇÃO
// ==========================================
onMounted(() => {
  if (!user.value || !user.value.role) {
    router.push('/login');
  } else {
    loadData();
  }
});
</script>

<style scoped>
/* =========================================
   ESTRUTURA PRINCIPAL
========================================= */
.dashboard-wrapper {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
}

.main-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* =========================================
   NAVBAR E CABEÇALHO
========================================= */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  color: white;
  padding: 15px 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge {
  background-color: #3b82f6;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.btn-logout {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-logout:hover { background-color: #dc2626; }

/* =========================================
   LAYOUT MASTER (O GRID DE CARDS)
========================================= */
.master-layout {
  width: 100%;
  padding: 10px 0;
}

.grid-3-cols {
  display: flex;
  gap: 25px;
  overflow-x: auto; /* Ativa a barra de rolagem inferior */
  padding: 15px 5px;
  width: 50%;
  scrollbar-width: thin; /* Estilo fino no Firefox */
}

/* GARANTE QUE OS CARDS TENHAM 300PX E NÃO ESTIQUEM */
.grid-3-cols > .card {
  flex: 0 0 300px; /* Largura fixa */
  min-width: 300px; 
  max-width: 300px; 
  display: flex;
  flex-direction: column;
}

/* Estilização da Barra de Rolagem (Chrome/Edge/Safari) */
.grid-3-cols::-webkit-scrollbar { height: 10px; }
.grid-3-cols::-webkit-scrollbar-track { background: #e2e8f0; border-radius: 10px; }
.grid-3-cols::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; border: 2px solid #e2e8f0; }
.grid-3-cols::-webkit-scrollbar-thumb:hover { background: #64748b; }

/* =========================================
   CARDS GENÉRICOS
========================================= */
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
.shadow { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.border-blue { border-top: 4px solid #3b82f6; }
.border-green { border-top: 4px solid #10b981; }

.subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

/* =========================================
   FORMULÁRIOS
========================================= */
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row-custom {
  display: flex;
  gap: 10px;
}

input, select {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}
input:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.input-readonly {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

/* =========================================
   BOTÕES
========================================= */
.btn-primary, .btn-primary-sm {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.btn-primary:hover { background-color: #2563eb; }

.btn-success, .btn-success-sm {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.btn-success:hover { background-color: #059669; }

.btn-save { background-color: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; }
.btn-cancel { background-color: #94a3b8; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; }
.btn-clear { background-color: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; }
.btn-action { background: none; border: none; cursor: pointer; font-size: 1.2rem; }

/* =========================================
   LAYOUT ADMIN (SIDEBAR E MAIN)
========================================= */
.layout-admin {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.sidebar {
  width: 300px;
  flex-shrink: 0;
}
.main-panel {
  flex-grow: 1;
  overflow-x: auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.mb-20 { margin-bottom: 20px; }
.mt-20 { margin-top: 20px; }

/* =========================================
   FILTROS E TABELA
========================================= */
.filters-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}
.admin-table th, .admin-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}
.admin-table th { background-color: #f1f5f9; color: #475569; }
.text-pink { color: #ec4899; }

/* =========================================
   LAYOUT PACIENTE
========================================= */
.patient-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.info-card {
  background-color: #e0f2fe;
  border-left: 5px solid #0284c7;
}
.patient-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.app-item {
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 0;
}
.specialty { color: #64748b; font-size: 0.9rem; }
.weather { color: #0ea5e9; font-weight: bold; }

/* =========================================
   LAYOUT MÉDICO
========================================= */
.medico-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}
.medico-app-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  background: #f8fafc;
  border-left: 4px solid #10b981;
}
.medico-app-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 5px;
}
.medico-time {
  font-weight: bold;
  color: #10b981;
}
</style>