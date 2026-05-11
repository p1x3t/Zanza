const Profile = {
  async open() {
    if (!Auth.user) return Auth.openLogin();
    
    document.getElementById('modalProfile').classList.add('open');
    this.loadForm();
  },

  close() {
    document.getElementById('modalProfile').classList.remove('open');
  },

  loadForm() {
    const user = Auth.user;
    const fields = ['nome', 'email', 'telefone', 'nomeLoja', 'descricao', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'];
    fields.forEach(f => {
      const el = document.getElementById(`p${f.charAt(0).toUpperCase() + f.slice(1)}`);
      if (el && user[f]) el.value = user[f];
    });
  },

  async fetchCep(cep) {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        document.getElementById('pLogradouro').value = data.logradouro || '';
        document.getElementById('pBairro').value = data.bairro || '';
        document.getElementById('pCidade').value = data.localidade || '';
        document.getElementById('pUf').value = data.uf || '';
      }
    } catch (e) {
      console.warn('Erro ao buscar CEP:', e);
    }
  },

  previewAvatar(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
    
    const reader = new FileReader();
    reader.onload = ev => document.getElementById('profileAvatar').src = ev.target.result;
    reader.readAsDataURL(file);
  },

  async save(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSaveProfile');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    const data = {
      nome: document.getElementById('pNome').value,
      email: document.getElementById('pEmail').value,
      telefone: document.getElementById('pTelefone').value,
      nomeLoja: document.getElementById('pNomeLoja').value,
      descricao: document.getElementById('pDescricao').value,
      cep: document.getElementById('pCep').value,
      street: document.getElementById('pLogradouro').value,
      number: document.getElementById('pNumero').value,
      neighborhood: document.getElementById('pBairro').value,
      city: document.getElementById('pCidade').value,
      state: document.getElementById('pUf').value,
      complement: document.getElementById('pComplemento').value
    };

    try {
      const res = await fetch(`${API}/establishments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Auth.token}`
        },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erro ao salvar');
      
      // Atualiza usuário local com dados do estabelecimento
      Auth.user = { ...Auth.user, ...result };
      localStorage.setItem('user', JSON.stringify(Auth.user));
      
      this.showAlert('Estabelecimento cadastrado com sucesso', 'success');
      setTimeout(() => this.close(), 1500);
    } catch (err) {
      this.showAlert(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Salvar alterações';
    }
  },

  showAlert(msg, type) {
    const el = document.getElementById('profileAlert');
    el.textContent = msg;
    el.className = `alert alert-${type}`;
    el.style.display = 'block';
    if (type !== 'error') setTimeout(() => el.style.display = 'none', 4000);
  }
};