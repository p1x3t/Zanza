<img width="300" height="150" alt="1776984477" src="https://github.com/user-attachments/assets/a3f30668-1350-4c9d-905b-745f2a0fa225" />

# FRONTEND

<img width="300" height="100" alt="hjc-removebg-preview" src="https://github.com/user-attachments/assets/c0971196-53cc-45e0-8481-473f9b1e4bf8" />

# BACKEND

---

> Plataforma de estética e agendamento de serviços de beleza

![Zanza Preview](https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80)

## 📋 Sobre o Projeto

**Zanza** é uma plataforma web completa que conecta clientes a profissionais de estética e beleza. Com interface moderna e intuitiva, permite buscar estabelecimentos por localização, visualizar serviços disponíveis e realizar agendamentos em poucos cliques.

### ✨ Funcionalidades

#### Para Clientes
- 🔍 **Busca Inteligente**: Encontre profissionais por CEP, endereço ou geolocalização atual
- 🗺️ **Mapa Interativo**: Visualize estabelecimentos próximos com Leaflet.js
- 📅 **Agendamento Rápido**: Selecione serviço, data e horário em fluxo simplificado
- 💬 **Contato Direto**: Integração com WhatsApp para comunicação instantânea
- 🗺️ **Rotas**: Geração de trajetos via Google Maps
- 📱 **Design Responsivo**: Experiência otimizada para mobile, tablet e desktop

#### Para Profissionais
- 👤 **Perfil Personalizado**: Cadastro com foto, descrição, serviços e localização
- 📸 **Galeria de Trabalhos**: Upload de fotos para mostrar resultados
- 📍 **Geolocalização**: Pin de localização no mapa com arrastar e soltar
- 🔐 **Autenticação Segura**: Login com email/senha ou redes sociais (Google/Apple)

#### Gerais
- 🔐 Autenticação com validação de senha e recuperação de acesso
- 🌙 Sistema de temas com CSS Variables
- ♿ Acessibilidade com atributos ARIA e navegação por teclado
- 🌐 Suporte a múltiplos idiomas (estrutura preparada)
- 📰 Newsletter para engajamento
- 🤝 Área de parceiros institucionais

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Mapas** | Leaflet.js + OpenStreetMap |
| **APIs Externas** | ViaCEP, Nominatim (geocoding), Google Maps |
| **Armazenamento** | localStorage (mock de backend) |
| **Ícones** | SVG inline + emojis |
| **Fontes** | Google Fonts (Helvetica Neue, Georgia) |

## 🚀 Como Executar

### Pré-requisitos
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexão com internet para carregamento de APIs externas

### Passos

1. **Clone ou baixe o projeto**
```bash
git clone https://github.com/seu-usuario/zanza.git
cd zanza
```

2. **Abra o arquivo `index.html`**
```bash
# Opção 1: Diretamente no navegador
# Basta abrir o arquivo index.html

# Opção 2: Servidor local (recomendado para APIs)
# Com Python
python -m http.server 8000

# Com Node.js
npx serve .

# Com PHP
php -S localhost:8000
```

3. **Acesse no navegador**
```
http://localhost:8000
```

## 📁 Estrutura do Projeto

```
zanza/
├── index.html              # Arquivo principal (HTML + CSS + JS)
├── logo/                   # Logotipos de parceiros
│   ├── prefeitura-sp.png
│   └── univesp.png
└── README.md               # Este arquivo
```

> 📝 **Observação**: O projeto foi desenvolvido como single-file para facilitar deploy e prototipagem. Para produção, recomenda-se separar CSS e JS em arquivos distintos.

## 🎨 Design System

### Cores Principais
```css
:root {
  --primary: #A8D5BA;        /* Verde suave - marca */
  --primary-hover: #8FC9A3;  /* Hover dos botões */
  --bg: #FDFBF7;             /* Fundo geral */
  --surface: #FFFFFF;        /* Cards e modais */
  --text: #3E4A3D;           /* Texto principal */
  --text-muted: #666666;     /* Texto secundário */
}
```

### Tipografia
- **Títulos**: Georgia, serif
- **Corpo**: Helvetica Neue, Arial, sans-serif
- **Tamanhos**: Escala responsiva (1rem base)

### Animações
- `fadeIn`, `fadeInUp`: Entradas suaves
- `pulse`, `float`: Micro-interações
- `shimmer`: Efeito de loading
- Transições com `cubic-bezier` para naturalidade

## 🔧 Configuração e Personalização

### Alterar Cores da Marca
Edite as variáveis CSS em `:root` no `<style>`:
```css
:root {
  --primary: #SEU_CHEX;
  --primary-hover: #SEU_CHEX_HOVER;
}
```

### Configurar APIs
As seguintes APIs são utilizadas (todas gratuitas):

| API | Finalidade | Endpoint |
|-----|-----------|----------|
| ViaCEP | Busca de CEP brasileiro | `https://viacep.com.br/ws/{CEP}/json/` |
| Nominatim | Geocoding reverso | `https://nominatim.openstreetmap.org/` |
| OpenStreetMap | Tiles do mapa | `https://{s}.tile.openstreetmap.org/` |

> ⚠️ **Nominatim Usage Policy**: Máximo de 1 requisição/segundo. Para produção, considere usar serviço próprio de geocoding.

### Dados Mockados
O projeto utiliza `localStorage` para persistência local:
```javascript
// Usuários
localStorage.getItem('usuariosZanza')
localStorage.getItem('usuarioZanza')

// Perfil do profissional
localStorage.getItem('perfilZanza')
```

## 📱 Responsividade

| Breakpoint | Dispositivo | Comportamento |
|------------|-------------|---------------|
| `>1024px` | Desktop | Layout completo com sidebar |
| `768px-1024px` | Tablet | Grid adaptativo |
| `<768px` | Mobile | Menu colapsado, cards em coluna |
| `<480px` | Mobile pequeno | Fontes e espaçamentos reduzidos |

## ♿ Acessibilidade

- ✅ Atributos `aria-*` em modais e elementos interativos
- ✅ Contraste de cores adequado (WCAG AA)
- ✅ Navegação por teclado (`:focus-visible`)
- ✅ `prefers-reduced-motion` para usuários sensíveis
- ✅ Labels associadas a inputs
- ✅ Textos alternativos em imagens

## 🔐 Segurança (Frontend)

> ⚠️ **Atenção**: Este é um protótipo frontend. Para produção:

```diff
- Não use localStorage para dados sensíveis
- Implemente backend com autenticação JWT/OAuth
- Valide todos os dados no servidor
- Use HTTPS em todas as requisições
- Implemente rate limiting nas APIs
```

## 🧪 Testes Manuais

1. **Busca por CEP**
   - Digite `01310-100` (Av. Paulista)
   - Clique em "Buscar"
   - Verifique marcadores no mapa

2. **Agendamento**
   - Clique em um estabelecimento
   - Selecione serviço → data → horário
   - Confirme e veja a tela de sucesso

3. **Cadastro de Profissional**
   - Clique em "Sou profissional"
   - Preencha o formulário de registro
   - Acesse o perfil e edite dados

4. **Responsividade**
   - Redimensione a janela
   - Teste no modo mobile do DevTools

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- Use as variáveis CSS existentes para cores e espaçamentos
- Mantenha as animações com as durations definidas (`--transition-*`)
- Adicione atributos de acessibilidade em novos componentes
- Comente apenas lógica complexa (o código deve ser autoexplicativo)

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

```
MIT / BSD License

Copyright (c) 2030 Zanza

Permission is hereby granted...
```

<div align="center">
  <sub>Feito com 💚 por <strong>Zanza Team</strong></sub><br>
  <sub>Transformando beleza em experiência digital</sub>
</div>
