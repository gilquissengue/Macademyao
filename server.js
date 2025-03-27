// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos (adicionados mais métodos)
    credentials: true, // Permite credenciais
    allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

// Chave secreta para JWT - idealmente deveria estar no .env
const JWT_SECRET = process.env.JWT_SECRET || 'money-academy-chave-super-segura-2024';

// 👇👇👇 LISTA DOS SEUS E-MAILS (COPIE E COLE SEUS E-MAILS AQUI!) 👇👇👇
const ALLOWED_EMAILS = [
    'deoliveirafilo6@gmail.com',
    'micmc390@gmail.com',
    'darioastrovibe@gmail.com',
    'domingoscalei53@gmail.com',
    'carlosmac482@gmail.com',
    'zagebento@hotmail.com',
    'nzuzimbemba11@gmail.com',
    'enoquesachicolamaliti@gmail.com',
    'manuellucasandre42@gmail.com',
    'afonsoadilson568@gmail.com',
    'erivaldomobteiro15@gmail.com',
    'e0844561@gmail.com',
    'gilbertoquissengue@gmail.com',
    'singlejoao0@gmail.com' // 👈 VERIFIQUE SE ESTÁ ESCRITO CORRETAMENTE!
].map(email => email.trim().toLowerCase());

// Middleware para verificar autenticação (simplificado e mais flexível)
const verificarToken = (req, res, next) => {
    // Aceita token em qualquer formato: cabeçalho, query, cookie ou body
    const token = 
        req.headers.authorization?.split(' ')[1] || 
        req.query.token || 
        req.cookies?.token || 
        req.body?.token;
    
    if (!token) {
        return res.status(401).json({ error: "🔒 Acesso negado! Token não fornecido." });
    }
    
    try {
        // Verificar se o token é válido (sem verificar expiração)
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "🔒 Token inválido!" });
    }
};

// Rota de Login (SEM EXPIRAÇÃO DO TOKEN)
app.post('/auth/login', (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        
        // Debug: Mostra o e-mail recebido
        console.log("-----------------------------------");
        console.log("E-mail recebido:", email);
        console.log("Está na lista?", ALLOWED_EMAILS.includes(email));
        console.log("-----------------------------------");

        // Validação do formato
        if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ error: "❌ E-mail inválido!" });
        }

        // Verificação na lista
        if (ALLOWED_EMAILS.includes(email)) {
            // Criar token SEM EXPIRAÇÃO (permanente)
            const token = jwt.sign(
                { email }, 
                JWT_SECRET
                // Sem a opção 'expiresIn', o token NUNCA expira
            );
            
            // Retornar o token para o cliente armazenar
            return res.status(200).json({ 
                success: true,
                token,
                usuario: { email },
                message: "Login realizado com sucesso!"
            });
        } else {
            // Negar acesso para e-mails não autorizados
            return res.status(403).json({ error: "🔒 Acesso negado! E-mail não autorizado." });
        }

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// Rota pública para testar se o servidor está online
app.get('/', (req, res) => {
    res.status(200).json({ message: "Servidor Money Academy online!" });
});

// Rota protegida de exemplo - Dashboard
app.get('/dashboard', verificarToken, (req, res) => {
    return res.status(200).json({ 
        message: "🎉 Acesso autorizado ao Dashboard!",
        usuario: req.usuario
    });
});

// Verificar se o token é válido
app.get('/auth/verificar', verificarToken, (req, res) => {
    return res.status(200).json({ 
        valido: true,
        usuario: req.usuario
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));