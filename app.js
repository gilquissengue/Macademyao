// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Adicionando JWT

// Chave secreta para assinatura de tokens (ideal colocar no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_muito_segura';
const TOKEN_EXPIRY = '365d'; // Token válido por 1 ano para longa persistência

const app = express();
app.use(express.json());

// Configuração mais permissiva do CORS para funcionar em qualquer dispositivo
app.use(cors({
    origin: '*',               // Permite acesso de qualquer origem
    methods: ['GET', 'POST'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true          // Permite cookies em requisições cross-origin
}));

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

// Log de todos os emails permitidos no início
console.log("🔑 Lista de emails permitidos:");
ALLOWED_EMAILS.forEach((email, index) => {
    console.log(`${index + 1}. ${email}`);
});

// Middleware para verificar autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: "Acesso negado! Token não fornecido." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado." });
        }
        req.user = user;
        next();
    });
};

// Rota de Login (AGORA COM TOKEN JWT)
app.post('/auth/login', (req, res) => {
    try {
        // Obter e preparar o email (removendo espaços e convertendo para minúsculas)
        const email = req.body.email ? req.body.email.toString().trim().toLowerCase() : '';
        
        // Debug: Informações detalhadas
        console.log("\n===== TENTATIVA DE LOGIN =====");
        console.log("📧 E-mail recebido:", email);
        console.log("📝 Body completo:", JSON.stringify(req.body));
        
        // Verificar se o email está vazio
        if (!email) {
            console.log("❌ E-mail vazio ou não fornecido");
            return res.status(400).json({ error: "❌ E-mail inválido ou não fornecido!" });
        }

        // Verificação na lista (sem validar formato para ser mais permissivo)
        const isAllowed = ALLOWED_EMAILS.includes(email);
        console.log("✅ Está na lista?", isAllowed);
        
        if (isAllowed) {
            // Gerar token JWT para o usuário com validade muito longa
            const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
            
            // Permitir acesso para e-mails autorizados (com token)
            console.log("🔓 Acesso permitido para:", email);
            return res.status(200).json({ 
                success: true,
                message: "Acesso permitido! Sua sessão permanecerá ativa até você sair.",
                token: token, // Token que deve ser armazenado pelo cliente
                expiresIn: TOKEN_EXPIRY
            });
        } else {
            // Retornar erro para e-mails não autorizados
            console.log("🔒 Acesso negado para:", email);
            return res.status(403).json({ 
                error: "🔒 Acesso negado! E-mail não autorizado."
            });
        }

    } catch (error) {
        console.error("❗️ ERRO:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// Nova rota de logout - para quando o usuário quiser sair explicitamente
app.post('/auth/logout', (req, res) => {
    // Nota: No lado do cliente, você deve remover o token do armazenamento local
    return res.status(200).json({ 
        success: true, 
        message: "Logout realizado com sucesso. O token deve ser removido pelo cliente."
    });
});

// Rota protegida exemplo (dashboard)
app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ 
        success: true, 
        message: "Bem-vindo ao dashboard!",
        user: req.user
    });
});

// Rota para verificar status da autenticação
app.get('/auth/status', authenticateToken, (req, res) => {
    res.json({ 
        isLoggedIn: true, 
        user: req.user,
        message: "Usuário está autenticado e sessão ativa"
    });
});

// Rota simples para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('API funcionando! Use a rota POST /auth/login para autenticar.');
});

// Rota para verificar se um email está na lista (útil para debugging)
app.get('/check-email', (req, res) => {
    const email = req.query.email?.trim().toLowerCase();
    if (!email) {
        return res.status(400).json({ error: "Email não fornecido" });
    }
    
    const isAllowed = ALLOWED_EMAILS.includes(email);
    return res.json({ 
        email,
        isAllowed,
        message: isAllowed ? "Email autorizado" : "Email não autorizado" 
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));