const allowedEmails = ['email1@example.com', 'email2@example.com']; // Adicione os e-mails permitidos aqui

function authenticateUser(email, password) {
    // Verifica se o e-mail está na lista de permitidos
    if (allowedEmails.includes(email)) {
        // Permite o acesso sem verificar a senha
        console.log(`✅ Acesso concedido para ${email}`);
        return true; // ou qualquer lógica que você use para conceder acesso
    } else {
        // Lógica para e-mails não permitidos
        console.log(`❌ Acesso negado para ${email}`);
        return false; // ou qualquer lógica que você use para negar acesso
    }
}

// Exemplo de uso
authenticateUser('email1@example.com', 'qualquerSenha'); // Acesso concedido
authenticateUser('email3@example.com', 'qualquerSenha'); // Acesso negado 