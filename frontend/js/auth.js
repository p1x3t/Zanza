const API = 'http://localhost:3001/api';

const Auth = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  init() {
    if (this.token && this.user) {
      this.updateHeader();
    }
    this.setupPasswordStrength();
  },

  openLogin() {
    document.getElementById('modalAuth').classList.add('open');
    this.switchTab('login');
    this.clearAlerts();
  },

  close() {
    document.getElementById('modalAuth').classList.remove('open');
  },

  switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('formLogin').classList.toggle('hidden', tab !== 'login');
    document.getElementById('formRegister').classList.toggle('hidden', tab !== 'register');
    this.clearAlerts();
  },

  togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  setupPasswordStrength() {
    const input = document.getElementById('registerPassword');
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    
    input?.addEventListener('input', (e) => {
      const val = e.target.value;
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;

      const colors = ['#c62828', '#ef9a2e', '#2e7d32', '#1b5e20'];
      fill.style.width = `${score * 25}%`;
      fill.style.background = colors[score - 1] || '#e0e0e0';
      text.textContent = ['Fraca', 'Média', 'Forte', 'Muito forte'][score - 1] || 'Força da senha';
    });
  },

  async login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = e.target.querySelector('button[type="submit"]');
    
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');
      
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.close();
      this.updateHeader();
      this.showAlert('Login realizado com sucesso', 'success');
    } catch (err) {
      this.showAlert(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  },

  async register(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById('registerName').value,
      email: document.getElementById('registerEmail').value,
      phone: document.getElementById('registerPhone').value,
      password: document.getElementById('registerPassword').value,
      terms: document.getElementById('registerTerms').checked
    };

    if (!data.terms) return this.showAlert('Aceite os termos para continuar', 'error');

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Criando conta...';

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Erro ao criar conta');
      
      this.token = result.token;
      this.user = result.user;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      this.close();
      this.updateHeader();
      this.showAlert('Conta criada com sucesso', 'success');
    } catch (err) {
      this.showAlert(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Criar conta';
    }
  },

  loginGoogle() {
    window.location.href = `${API}/auth/google`;
  },

  logout() {
    if (confirm('Deseja sair da conta?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.token = null;
      this.user = null;
      this.updateHeader();
      this.showAlert('Você saiu da conta', 'info');
    }
  },

  updateHeader() {
    const container = document.getElementById('navActions');
    if (this.user) {
      const initial = this.user.name?.charAt(0).toUpperCase() || 'U';
      container.innerHTML = `
        <button class="btn btn-avatar" onclick="Profile.open()" title="${this.user.name}">${initial}</button>
        <button class="btn btn-outline btn-sm" onclick="Auth.logout()">Sair</button>
      `;
    } else {
      container.innerHTML = `
        <button class="btn btn-outline btn-sm" onclick="Auth.openLogin()">Entrar</button>
        <button class="btn btn-primary btn-sm" onclick="App.scrollToAgendamento()">Agendar</button>
      `;
    }
  },

  showAlert(msg, type = 'info') {
    const el = document.getElementById('authAlert');
    el.textContent = msg;
    el.className = `alert alert-${type}`;
    el.style.display = 'block';
    if (type !== 'error') setTimeout(() => el.style.display = 'none', 4000);
  },

  clearAlerts() {
    document.querySelectorAll('.alert').forEach(el => el.style.display = 'none');
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());