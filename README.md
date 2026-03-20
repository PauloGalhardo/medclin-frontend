________________________________________
🩺 MedClin - Sistema de Gestão Clínica Inteligente

Plataforma Full-Stack com Integração Climática e Geográfica
O MedClin é uma solução completa para a gestão de clínicas e consultórios, desenvolvida para modernizar a interação entre médicos, administradores e pacientes. O sistema utiliza uma arquitetura distribuída, focada em usabilidade (Heurísticas de Nielsen) e em serviços inteligentes baseados na localização do paciente.
🚀 Status do Projeto: Em Produção (Cloud)
________________________________________
🔗 Links Úteis

🌐 Acesso ao Sistema (Ambiente de Produção)
●	Aplicação Web (Frontend): https://medclin-frontend.vercel.app/
●	API Service (Backend): https://medclin-api.onrender.com/

💻 Repositórios de Código (GitHub)
●	Código-Fonte Frontend: https://github.com/PauloGalhardo/medclin-frontend
●	Código-Fonte Backend: https://github.com/PauloGalhardo/medclin-ban
________________________________________
💎 Diferenciais e Funcionalidades

●	Bloqueio de Agenda Duplicada: Lógica de backend que impede conflitos de horário para o mesmo médico, garantindo integridade na escala de consultas.
●	Lógica de Normalização de dados: Diferente de sistemas comuns, as consultas não armazenam o CEP. O sistema realiza um link dinâmico com o cadastro do paciente, garantido que, se o paciente mudar de endereço, todas as consultas futuras reflitam o clima da nova localidade automaticamente,
●	Suporte à Decisão Climática: Integração com a API OpenWeatherMap para exibir as condições do tempo no dia da consulta, auxiliando o paciente e a clínica no planejamento.
●	Automação de Endereço: Integração com a API ViaCEP para preenchimento automático de logradouro, bairro e cidade a partir do CEP.
●	Integração Dual-API: Consumo síncrono da ViaCEP para automação de endereço e da OpenWeatherMap para suporte à decisão (ex: prever dificuldades de deslocamento em dias de chuva.
●	Interface Responsiva: Layout adaptativo utilizando Flexbox e CSS Grid com Media Queries, otimizado para Desktop e Mobile.
●	Design Heurístico: Interface projetada sob os princípios das 10 Heurísticas de Jakob Nielsen, priorizando a prevenção de erros e a clareza de status.
________________________________________
🛠 Stack Tecnológica
Camada	Tecnologia	Provedor de Cloud
Frontend	Vue.js 3, Axios, CSS3	Vercel
Backend	Node.js, Express, JWT, Bcrypt	Render
Banco de Dados	MongoDB (Mongoose)	MongoDB Atlas
________________________________________
📂 Funcionalidades por Nível de Acesso

1. Dashboard Master (Gestor de Infraestrutura)

Triplo Cadastro: Cards independentes para Administradores, Médicos e Pacientes.
Layout Fixo: Organização em grid horizontal que preserva a largura dos cards para facilitar o preenchimento de formulários densos.
Geolocalização: Cadastro de paciente com busca de CEP integrada.

2. Dashboard Admin (Operacional)

Gestão de Consultas: CRUD completo com filtros dinâmicos por Paciente e Médico.
Inteligência Climática: Visualização em tempo real do clima para cada agendamento baseado no endereço do paciente cadastrado.

3. Dashboard Médico (Agenda Profissional)

Layout Moderno: Visualização da agenda em formato de *cards* informativos (Grid Layout).
Foco no Atendimento: Exibição clara de horários, contatos rápidos do paciente e condições climáticas.

4. Dashboard Paciente (Autoatendimento)

Agendamento Simplificado: Fluxo de marcação de consultas em apenas dois cliques.
Transparência: Acompanhamento do status das consultas e informações úteis sobre o dia do atendimento.

________________________________________

Endpoints Principais (API)

Autenticação & Usuários

•	`POST /auth/register` - Criação de usuários (Admin/Paciente).
•	`POST /auth/login` - Autenticação e geração de Token JWT.
•	`GET /auth/patients` - Lista de pacientes (protegido por perfil).

Médicos

•	`GET /doctors` - Lista todos os médicos e especialidades.
•	`POST /doctors` - Cadastro de novos profissionais.

Agendamentos
•   `GET /agendamentos` - Recupera consultas (filtra automaticamente por perfil via Token).
•	`POST /agendamentos` - Cria nova consulta (vincula `patientId` automaticamente).
•	`PUT /agendamentos/:id` - Atualização de horários e profissionais.
•	`DELETE /agendamentos/:id` - Cancelamento de consulta.

________________________________________

📂 Como Executar Localmente

1. Servidor (Backend)
Bash
# Clone o repositório
git clone https://github.com/PauloGalhardo/medclin-backend.git
cd medclin-backend

# Instale as dependências
npm install

# Configure o arquivo .env com sua MONGO_URI e JWT_SECRET
# Inicie o servidor
npm start

2. Cliente (Frontend)
Bash
# Clone o repositório
git clone https://github.com/PauloGalhardo/medclin-frontend.git
cd medclin-frontend

# Instale as dependências
npm install

# Inicie a aplicação em modo de desenvolvimento
npm run dev

________________________________________

🔐 Segurança e Variáveis de Ambiente
Para o funcionamento correto em produção, as seguintes chaves foram configuradas nos painéis da Vercel e do Render:
●	MONGO_URI: String de conexão com o cluster MongoDB Atlas.
●	JWT_SECRET: Chave para criptografia dos tokens de autenticação.
●	VITE_API_URL: Endereço da API no Render (para o frontend).
________________________________________
