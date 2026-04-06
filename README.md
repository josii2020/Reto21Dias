# Reto 21 Días 🔥

Webapp de plan de alimentación y ejercicio de 21 días con suscripción mensual via Lemon Squeezy.

## Setup rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Lemon Squeezy
Abrí `src/App.jsx` y cambiá la URL del checkout:
```js
const CHECKOUT_URL = "https://TU-TIENDA.lemonsqueezy.com/buy/TU-PRODUCTO-ID";
```

### 3. Correr en local
```bash
npm run dev
```

### 4. Deploy en Vercel
1. Subí este repo a GitHub
2. Andá a vercel.com → "Add New Project"
3. Importá el repo
4. Vercel detecta Vite automáticamente → Deploy

### 5. Conectar dominio
En Vercel → Settings → Domains → agregá tu dominio

## Stack
- **Frontend**: React + Vite
- **Pagos**: Lemon Squeezy (Merchant of Record)
- **Hosting**: Vercel
- **Fonts**: Sora + JetBrains Mono (Google Fonts)
