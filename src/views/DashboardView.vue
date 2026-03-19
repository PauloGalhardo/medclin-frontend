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
      
      <div v-if="user.role === 'master'" class="master-scroll-container">
        <div class="top-scrollbar-wrapper" ref="topScroll" @scroll="syncScroll('top')">
        <div class="top-scrollbar-content" :style="{ width: scrollWidth + 'px' }"></div>
      </div>

        <div class="grid-3-cols" ref="bottomScroll" @scroll="syncScroll('bottom')">
        <div v-for="item in lista" :key="item.id" class="card">
         </div>
      </div>
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

          <section class="card shadow">
            <h3>👤 Cadastrar Paciente</h3>
            <form @submit.prevent="registerUser" class="form-stack">
              <input v-model="newUser.name" placeholder="Nome" required />
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
              <button type="submit" class="btn-primary">Registrar</button>
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

          <div v-if="showNovaConsulta" class="nova-consulta-box mb-20">
            <h4 style="margin-top: 0;">📅 Agendar Atendimento</h4>
            <form @submit.prevent="saveAppointment" class="form-grid-inline">
              <select v-model="form.patientId" required :disabled="isEditing">
                <option value="" disabled>Paciente...</option>
                <option v-for="p in patients" :key="p._id" :value="p._id">{{ p.name }}</option>
              </select>
              <select v-model="form.doctorName" required>
                <option value="" disabled>Médico...</option>
                <option v-for="d in doctors" :key="d._id" :value="d.name">{{ d.name }}</option>
              </select>
              <input v-model="form.date" type="date" :min="tomorrow" required />
              <input v-model="form.time" type="time" required />
              <button type="submit" class="btn-save">{{ isEditing ? 'Atualizar' : 'Salvar Consulta' }}</button>
              <button type="button" v-if="isEditing" @click="cancelEdit" class="btn-cancel">Cancelar</button>
            </form>
          </div>

          <div class="filters-row mb-20">
            <div class="filter-item">
              <label>Filtrar por Paciente:</label>
              <select v-model="filterPatient">
                <option value="">Todos os Pacientes</option>
                <option v-for="p in patients" :key="p._id" :value="p.name">{{ p.name }}</option>
              </select>
            </div>
            
            <div class="filter-item">
              <label>Filtrar por Médico:</label>
              <select v-model="filterDoctor">
                <option value="">Todos os Médicos</option>
                <option v-for="d in doctors" :key="d._id" :value="d.name">{{ d.name }}</option>
              </select>
            </div>

            <div class="filter-action">
              <button @click="filterPatient = ''; filterDoctor = ''" class="btn-clear">Limpar Filtros</button>
            </div>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>PACIENTE / CONTATO</th>
                <th>MÉDICO</th>
                <th>DATA/HORA</th>
                <th>CLIMA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in filteredApps" :key="app._id">
                <td>
                  <strong>{{ getPatientName(app.patientId) }}</strong><br/>
                  <small class="text-pink">📞 {{ getPatientPhone(app.patientId) }}</small>
                </td>
                <td>{{ app.doctorName }}</td>
                <td>{{ formatDate(app.date) }} <br/><small>às {{ app.time }}h</small></td>
                <td><small>{{ app.weatherInfo || 'Buscando...' }}</small></td>
                <td>
                  <button @click="editApp(app)" class="btn-action">✏️</button>
                  <button @click="deleteApp(app._id)" class="btn-action">🗑️</button>
                </td>
              </tr>
              <tr v-if="filteredApps.length === 0">
                <td colspan="5" style="text-align: center; color: #64748b; padding: 20px;">Nenhuma consulta localizada.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div v-if="user.role === 'paciente'" class="patient-layout">
        <section class="card shadow info-card">
          <h3>📜 Histórico e Informações</h3>
          <p>Bem-vindo ao seu portal. Abaixo você pode realizar novos agendamentos ou consultar suas marcações atuais e a previsão do tempo baseada no seu endereço.</p>
        </section>

        <div class="patient-grid">
          <section class="card shadow border-blue">
            <h3>📅 Marcar Consulta</h3>
            <form @submit.prevent="saveAppointment" class="form-stack">
              <select v-model="form.doctorName" required>
                <option value="" disabled>Selecione o Médico...</option>
                <option v-for="d in doctors" :key="d._id" :value="d.name">{{ d.name }}</option>
              </select>
              <label>Data:</label>
              <input v-model="form.date" type="date" :min="tomorrow" required />
              <input v-model="form.time" type="time" required />
              <button type="submit" class="btn-primary">Finalizar Agendamento</button>
            </form>
          </section>

          <section class="card shadow">
            <h3>📅 Minhas Consultas</h3>
            <div v-if="filteredApps.length === 0" class="empty">Nenhuma consulta.</div>
            <div v-for="app in filteredApps" :key="app._id" class="app-item">
              <strong>{{ app.doctorName }}</strong> 
              <span class="specialty">({{ getSpecialty(app.doctorName) }})</span>
              <p>{{ formatDate(app.date) }} às {{ app.time }}h</p>
              <small class="weather">{{ app.weatherInfo || 'Buscando previsão...' }}</small>
            </div>
          </section>
        </div>
      </div>

      <div v-if="user.role === 'medico'" class="view-medico">
        <section class="card shadow">
          <h3>📋 Minha Agenda de Consultas</h3>
          <div class="medico-grid mt-20">
            <div v-for="app in filteredApps" :key="app._id" class="medico-app-card">
              <div class="medico-app-header">
                <strong>{{ getPatientName(app.patientId) }}</strong>
                <span class="medico-time">{{ app.time }}h</span>
              </div>
              <div class="medico-app-body">
                <p>📅 {{ formatDate(app.date) }}</p>
                <p>📞 {{ getPatientPhone(app.patientId) }}</p>
              </div>
            </div>
          </div>
          <div v-if="filteredApps.length === 0" style="text-align: center; color: #64748b; padding: 20px;">
            Não há consultas agendadas para você no momento.
          </div>
        </section>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');

const appointments = ref([]);
const patients = ref([]);
const doctors = ref([]);

// --- LÓGICA DE SINCRONIZAÇÃO DE SCROLL ---
const topScroll = ref(null);
const mainContent = ref(null);
const scrollWidth = ref(0);

// Sincroniza o movimento das duas barras
const syncScroll = (source) => {
  if (source === 'top') {
    bottomScroll.value.scrollLeft = topScroll.value.scrollLeft;
  } else {
    topScroll.value.scrollLeft = bottomScroll.value.scrollLeft;
  }
};

// Calcula a largura real do conteúdo para a barra de cima saber quanto scrollar
const updateScrollWidth = () => {
  if (bottomScroll.value) {
    scrollWidth.value = bottomScroll.value.scrollWidth;
  }
};

onMounted(async () => {
  await nextTick();
  updateScrollWidth();
  // Atualiza se a janela mudar de tamanho
  window.addEventListener('resize', updateScrollWidth);
});
// ----------------------------------------

const filterPatient = ref('');
const filterDoctor = ref('');
const showNovaConsulta = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const newUser = ref({ name: '', email: '', password: '', phone: '', role: 'paciente', cep: '', logradouro: '', bairro: '', cidade: '', estado: '', numero: '', complemento: '' });
const newAdmin = ref({ name: '', email: '', password: '', phone: '', role: 'admin' });
const newDoctor = ref({ name: '', specialty: '', phone: '', email: '', password: '' });
const form = ref({ patientId: user.role === 'paciente' ? user.id : '', doctorName: '', date: '', time: '' });

const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const formatDate = (d) => d ? d.split('-').reverse().join('/') : '';
const getSpecialty = (n) => doctors.value.find(d => d.name === n)?.specialty || 'Médico';

const buscarCep = async () => {
  const cepLimpo = newUser.value.cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        newUser.value.logradouro = data.logradouro;
        newUser.value.bairro = data.bairro;
        newUser.value.cidade = data.localidade;
        newUser.value.estado = data.uf;
      }
    } catch (e) { console.error("Erro ao buscar CEP", e); }
  }
};

const getPatientPhone = (patientData) => {
  if (!patientData) return 'N/I';
  if (patientData.phone) return patientData.phone;
  const id = typeof patientData === 'object' ? patientData._id : patientData;
  const found = patients.value.find(p => p._id === id);
  return found?.phone || 'N/I';
};

const getPatientName = (patientData) => {
  if (!patientData) return 'Paciente Excluído';
  if (patientData.name) return patientData.name;
  const id = typeof patientData === 'object' ? patientData._id : patientData;
  const found = patients.value.find(p => p._id === id);
  return found?.name || 'Paciente Excluído';
};

const filteredApps = computed(() => {
  let list = [...appointments.value];
  if (user.role === 'medico') {
    const loggedName = (user.name || '').trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    list = list.filter(a => (a.doctorName || '').trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === loggedName);
  } else if (user.role === 'paciente') {
    list = list.filter(a => (a.patientId?._id === user.id || a.patientId === user.id));
  } else {
    if (filterPatient.value) list = list.filter(a => getPatientName(a.patientId) === filterPatient.value);
    if (filterDoctor.value) list = list.filter(a => a.doctorName === filterDoctor.value);
  }
  return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
});

const formatPhone = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
  newUser.value.phone = v;
};

const formatPhoneAdmin = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
  newAdmin.value.phone = v;
};

const formatPhoneDoctor = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2");
  newDoctor.value.phone = v;
};

const fetchWeather = async (app) => {
  try {
    const pId = typeof app.patientId === 'object' ? app.patientId._id : app.patientId;
    const patientObj = patients.value.find(p => p._id === pId);
    const cepParaBusca = patientObj?.cep || (user.role === 'paciente' ? user.cep : null);
    if (!cepParaBusca) { app.weatherInfo = "Sem CEP no cadastro"; return; }
    const cepLimpo = cepParaBusca.replace(/\D/g, '');
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const viaCepData = await viaCepRes.json();
    if (viaCepData.erro) { app.weatherInfo = "CEP não encontrado"; return; }
    const apiKey = "74b698ace9294e908d01d1ebe83014f6"; 
    const cidade = encodeURIComponent(viaCepData.localidade);
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade},BR&units=metric&lang=pt_br&appid=${apiKey}`);
    if (!weatherRes.ok) throw new Error("Erro na API de Clima");
    const weatherData = await weatherRes.json();
    const climaDesc = weatherData.weather[0].description;
    const temp = Math.round(weatherData.main.temp);
    let icone = climaDesc.includes("chuva") ? "🌧️" : climaDesc.includes("limpo") ? "☀️" : "☁️";
    app.weatherInfo = `${icone} ${climaDesc.charAt(0).toUpperCase() + climaDesc.slice(1)}, ${temp}°C`;
  } catch (err) { app.weatherInfo = "Clima indisponível"; }
};

const loadData = async () => {
  try {
    const [resA, resD] = await Promise.all([api.get('/agendamentos'), api.get('/doctors')]);
    if (['admin', 'master', 'medico', 'paciente'].includes(user.role)) {
       const resP = await api.get('/auth/patients');
       patients.value = resP.data;
    }
    appointments.value = resA.data;
    appointments.value.forEach(a => fetchWeather(a));
    doctors.value = resD.data;
    updateScrollWidth(); // Atualiza a barra do Master após carregar
  } catch (err) { console.error(err); }
};

const registerAdmin = async () => {
  try {
    await api.post('/auth/register', newAdmin.value);
    alert("Administrador criado com sucesso!");
    newAdmin.value = { name: '', email: '', password: '', phone: '', role: 'admin' };
  } catch { alert("Erro ao criar administrador"); }
};

const registerUser = async () => {
  try {
    if (user.role === 'admin') newUser.value.role = 'paciente';
    await api.post('/auth/register', newUser.value);
    alert("Paciente criado com sucesso!");
    newUser.value = { name: '', email: '', password: '', phone: '', role: 'paciente', cep: '', logradouro: '', bairro: '', cidade: '', estado: '', numero: '', complemento: '' };
    loadData();
  } catch { alert("Erro ao criar usuário"); }
};

const saveDoctor = async () => {
  try {
    await api.post('/doctors', newDoctor.value);
    alert("Médico salvo!");
    newDoctor.value = { name: '', specialty: '', phone: '', email: '', password: '' };
    loadData();
  } catch { alert("Erro ao salvar médico"); }
};

const saveAppointment = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/agendamentos/${editingId.value}`, form.value);
    } else {
      await api.post('/agendamentos', form.value);
    }
    alert("Consulta salva com sucesso!");
    cancelEdit();
    showNovaConsulta.value = false;
    loadData();
  } catch (err) {
    // Tenta capturar a mensagem de erro vinda do Backend (400)
    const errorMsg = err.response?.data?.error || "Erro desconhecido ao agendar.";
    alert(errorMsg); 
  }
};

const editApp = (app) => {
  isEditing.value = true;
  editingId.value = app._id;
  form.value = { ...app, patientId: typeof app.patientId === 'object' ? app.patientId._id : app.patientId };
  showNovaConsulta.value = true; 
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = { patientId: user.role === 'paciente' ? user.id : '', doctorName: '', date: '', time: '' };
};

const deleteApp = async (id) => {
  if (confirm("Excluir agendamento?")) { await api.delete(`/agendamentos/${id}`); loadData(); }
};

const logout = () => { localStorage.clear(); router.push('/'); };

onMounted(() => {
  loadData();
  window.addEventListener('resize', updateScrollWidth);
});
</script>

<style scoped>
/* ESTRUTURA BASE E HEADER */
.dashboard-wrapper { width: 100%; min-height: 100vh; background: #f1f5f9; }
.navbar { width: 100%; background: #0f172a; color: white; padding: 1.2rem 3rem; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; }
.nav-user { display: flex; align-items: center; gap: 25px; }
.badge { background: #334155; padding: 5px 12px; border-radius: 6px; font-size: 0.7rem; }
.btn-logout { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.main-container { padding: 2rem 3rem; width: 100%; box-sizing: border-box; }

/* --- ESTILOS REVISADOS PARA BARRA DUPLA --- */
.master-scroll-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evita que o container pai quebre */
}

/* Barra de cima (fantasma) */
.top-scrollbar-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 12px;
  margin-bottom: 5px;
}

/* Esse conteúdo precisa ter a mesma largura que o grid de baixo */
.top-scrollbar-content {
  height: 1px;
}

.grid-3-cols { 
  display: flex; 
  gap: 20px; 
  overflow-x: auto; 
  padding-bottom: 15px;
  width: 100%;
}

/* Correção da largura dos Cards */
.grid-3-cols > .card { 
  flex: 0 0 350px; /* Largura fixa para os cards não esticarem */
  min-width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Estilização das barras (Webkit) */
.grid-3-cols::-webkit-scrollbar,
.top-scrollbar-wrapper::-webkit-scrollbar {
  height: 8px;
}
.grid-3-cols::-webkit-scrollbar-track,
.top-scrollbar-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.grid-3-cols::-webkit-scrollbar-thumb,
.top-scrollbar-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.layout-admin { display: grid; grid-template-columns: 320px 1fr; gap: 30px; align-items: start; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
.btn-primary-sm { background: #2563eb; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; }

.nova-consulta-box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; border-top: 4px solid #3b82f6; }
.form-grid-inline { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.form-grid-inline input, .form-grid-inline select { flex: 1; min-width: 130px; padding: 10px; }

.filters-row { display: flex; gap: 15px; align-items: flex-end; background: #f8fafc; padding: 15px; border-radius: 8px; }
.filter-item { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.filter-item label { font-size: 0.85rem; color: #64748b; font-weight: bold; }
.filter-action { padding-bottom: 2px; }
.btn-clear { background: #e2e8f0; color: #475569; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; }

.patient-layout { display: flex; flex-direction: column; gap: 30px; }
.patient-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.form-row-custom { display: flex; gap: 10px; }
.input-readonly { background: #f8fafc; color: #64748b; cursor: not-allowed; }

.medico-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.medico-app-card { background: white; border-radius: 12px; padding: 20px; border-left: 6px solid #10b981; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;}
.medico-app-header { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px; }
.medico-time { font-weight: bold; color: #10b981; }
.medico-app-body p { margin: 5px 0; color: #475569; font-size: 0.9rem; }

.card { background: white; border-radius: 12px; padding: 1.5rem; }
.shadow { box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
.subtitle { color: #64748b; font-size: 0.9rem; margin-top: -10px; margin-bottom: 20px; }
.form-stack { display: flex; flex-direction: column; gap: 12px; }
input, select { padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; width: 100%; box-sizing: border-box;}
.btn-primary, .btn-save { background: #2563eb; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-success, .btn-success-sm { background: #10b981; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-cancel { background: #ef4444; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; }

.admin-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.admin-table th { text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 0.8rem; }
.admin-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
.text-pink { color: #db2777; font-weight: bold; }

.app-item { background: #f8fafc; border-left: 5px solid #2563eb; padding: 15px; border-radius: 10px; margin-bottom: 15px; }
.specialty { color: #64748b; font-weight: normal; font-size: 0.9rem; }
.weather { color: #d97706; font-weight: bold; display: block; margin-top: 8px;}

.mb-20 { margin-bottom: 20px; }
.mt-20 { margin-top: 20px; }
.border-blue { border-top: 5px solid #2563eb; }
.border-green { border-top: 5px solid #10b981; }
</style>