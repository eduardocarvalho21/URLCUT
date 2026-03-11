# URLCUT ⚡

Encurtador de URLs com analytics em tempo real. Sem banco de dados, sem login — só colar e encurtar.

![Node.js](https://img.shields.io/badge/Node.js-v23-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## ✨ Funcionalidades

- 🔗 Encurtar qualquer URL com slug automático ou personalizado
- 📊 Analytics por dispositivo e navegador
- 🗑️ Deletar links
- ⚡ Interface visual moderna incluída
- 💾 Sem banco de dados — armazenamento em memória

---

## 🚀 Como rodar

```bash
# 1. Clone o repositório
git clone https://github.com/eduardocarvalho21/URLCUT.git
cd URLCUT

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm run dev
```

Acesse **http://localhost:3000** no navegador.

---

## 📁 Estrutura

```
URLCUT/
├── server.js                  # Entrada da aplicação
├── store.js                   # Armazenamento em memória
├── index.html                 # Interface visual
├── .env                       # Variáveis de ambiente
├── controllers/
│   └── urlController.js       # Lógica de URLs e analytics
└── routes/
    └── urls.js                # Rotas da API
```

---

## 📡 API

### Criar URL encurtada
```http
POST /urls
Content-Type: application/json

{
  "original": "https://exemplo.com/url-muito-longa",
  "slug": "meu-link"   // opcional
}
```

### Listar URLs
```http
GET /urls
```

### Ver analytics
```http
GET /urls/:slug/analytics
```

### Deletar URL
```http
DELETE /urls/:slug
```

### Redirecionar
```http
GET /:slug
```

---

## ⚙️ Variáveis de ambiente

| Variável   | Descrição                        | Padrão                  |
|------------|----------------------------------|-------------------------|
| `BASE_URL` | URL base para os links curtos    | `http://localhost:3000` |
| `PORT`     | Porta do servidor                | `3000`                  |

---

## 🛠️ Tecnologias

- **Node.js** + **Express** — servidor web
- **nanoid** — geração de slugs únicos
- **ua-parser-js** — detecção de dispositivo e navegador
- **dotenv** — variáveis de ambiente

---

> ⚠️ Os dados são armazenados em memória e são perdidos ao reiniciar o servidor.
