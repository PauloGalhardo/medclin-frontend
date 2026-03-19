<template>
  <div class="login-container">
    <header class="hero">
      <h1>🩺 Clínica Digital</h1>
      <p>Gestão de saúde simplificada</p>
    </header>

    <div class="cards-layout">
      
      <section class="auth-card shadow border-blue">
        <div class="card-header">
          <h2>{{ isLogin ? 'Acesso Geral' : 'Cadastro de Paciente' }}</h2>
          <p>{{ isLogin ? 'Pacientes, Admins e Master' : 'Crie sua conta em segundos' }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="form-stack">
          <template v-if="!isLogin">
            <input v-model="formData.name" placeholder="Nome Completo" required />
            <input v-model="formData.phone" placeholder="Telefone" @input="formatPhone" maxlength="15" required />
            
            <input v-model="formData.cep" placeholder="CEP (Apenas números)" @blur="buscarCep" maxlength="9" required />
            <input v-model="formData.logradouro" placeholder="Logradouro" readonly class="input-readonly" />
            <input v-model="formData.bairro" placeholder="Bairro" readonly class="input-readonly" />
            
            <div class="form-row">
              <input v-model="formData.cidade" placeholder="Cidade" readonly class="input-readonly" style="flex: 2;" />
              <input v-model="formData.estado" placeholder="UF" readonly class="input-readonly" style="flex: 1;" />
            </div>
            
            <div class="form-row">
              <input v-model="formData.numero" placeholder="Número" required style="flex: 1;" />
              <input v-model="formData.complemento" placeholder="Complemento" style="flex: 2;" />
            </div>
          </template>
          
          <input v-model="formData.email" type="email" placeholder="E-mail" required />
          <input v-model="formData.password" type="password" placeholder="Senha" required />
          
          <button type="submit" class="btn-primary">
            {{ isLogin ? 'Entrar' : 'Cadastrar' }}
          </button>
        </form>

        <div class="card-footer">
          <button @click="isLogin = !isLogin" class="btn-link">
            {{ isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Login' }}
          </button>
        </div>
      </section>

      <section class="auth-card shadow border-green">
        <div class="card-header">
          <h2>Acesso Médico</h2>
          <p>Portal restrito para profissionais</p>
        </div>
        <form @submit.prevent="handleDoctorLogin" class="form-stack">
          <input v-model="doctorData.email" type="email" placeholder="E-mail Profissional" required />
          <input v-model="doctorData.password" type="password" placeholder="Senha" required />
          <button type="submit" class="btn-success">Entrar como Médico</button>
        </form>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const isLogin = ref(true);

const formData = ref({ 
  name: '', email: '', password: '', phone: '', role: 'paciente',
  cep: '', logradouro: '', bairro: '', cidade: '', estado: '', numero: '', complemento: '' 
});

const doctorData = ref({ email: '', password: '' });

// Logica de busca de CEP (ViaCEP)
const buscarCep = async () => {
  const cepLimpo = formData.value.cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        formData.value.logradouro = data.logradouro;
        formData.value.bairro = data.bairro;
        formData.value.cidade = data.localidade;
        formData.value.estado = data.uf;
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao procurar CEP", error);
    }
  }
};

const formatPhone = (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  formData.value.phone = v;
};

const handleSubmit = async () => {
  try {
    const endpoint = isLogin.value ? '/auth/login' : '/auth/register';
    const res = await api.post(endpoint, formData.value);
    if (isLogin.value) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      router.push('/dashboard');
    } else {
      alert("Cadastro realizado com sucesso!");
      isLogin.value = true;
    }
  } catch (err) {
    alert(err.response?.data?.error || "Ocorreu um erro no acesso.");
  }
};

const handleDoctorLogin = async () => {
  try {
    const res = await api.post('/doctors/login', doctorData.value);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    router.push('/dashboard');
  } catch (err) {
    alert("Erro no login médico. Verifique as credenciais.");
  }
};
</script>

<style scoped>

.login-container { min-height: 100vh; background: #f1f5f9; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; }
.hero { text-align: center; margin-bottom: 40px; }

/* Posicionamento dos cards lado a lado */
.cards-layout { 
  display: flex; 
  flex-direction: row; 
  gap: 30px; 
  justify-content: center; 
  align-items: flex-start; 
  max-width: 1000px; 
  width: 100%; 
}

/* Dimensões do Card */
.auth-card { 
  background: white; 
  padding: 30px; 
  border-radius: 12px; 
  width: 400px; 
  box-sizing: border-box;
}

.border-blue { border-top: 5px solid #2563eb; }
.border-green { border-top: 5px solid #10b981; }

.form-stack { display: flex; flex-direction: column; gap: 15px; }
.form-row { display: flex; gap: 10px; }
input { padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; box-sizing: border-box; }

.input-readonly { background-color: #f8fafc; color: #64748b; cursor: not-allowed; }

.btn-primary { background: #2563eb; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.btn-success { background: #10b981; color: white; border: none; padding: 14px; border-radius: 8px; cursor: pointer; font-weight: bold; }
.card-footer { margin-top: 20px; text-align: center; }
.btn-link { background: none; border: none; color: #2563eb; text-decoration: underline; cursor: pointer; }
.shadow { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

@media (max-width: 850px) {
  .cards-layout { flex-direction: column; align-items: center; }
  .auth-card { width: 100%; max-width: 400px; }
}
</style>