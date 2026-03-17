<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Criar Conta</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label>Nome Completo</label>
          <input v-model="form.name" type="text" placeholder="Seu nome" required />
        </div>
        
        <div class="input-group">
          <label>E-mail</label>
          <input v-model="form.email" type="email" placeholder="seu@email.com" required />
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <input v-model="form.phone" type="tel" placeholder="(00) 00000-0000" />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input v-model="form.password" type="password" placeholder="********" required />
        </div>

        <button type="submit" class="btn-auth">Cadastrar</button>
      </form>
      <p class="auth-footer">
        Já tem conta? <router-link to="/">Faça Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const form = ref({
  name: '',
  email: '',
  phone: '', // Campo novo
  password: ''
});

const handleRegister = async () => {
  try {
    await api.post('/auth/register', form.value);
    alert('Cadastro realizado! Agora faça seu login.');
    router.push('/');
  } catch (err) {
    alert(err.response?.data?.error || 'Erro ao cadastrar.');
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}
.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
h2 { text-align: center; color: #1e293b; margin-bottom: 1.5rem; }
.input-group { margin-bottom: 1rem; }
.input-group label { display: block; font-size: 0.9rem; margin-bottom: 5px; color: #64748b; }
input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
.btn-auth { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; }
.auth-footer { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
</style>