# Money Academy - Sistema de Autenticação

Sistema simples de autenticação para Money Academy, que mantém o usuário logado até que ele decida sair explicitamente.

## Funcionalidades

- Login com email autorizado
- Autenticação persistente com JWT
- Proteção de rotas
- Verificação de token

## Instalação

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie um arquivo `.env` com as seguintes variáveis:
   ```
   JWT_SECRET=sua-chave-secreta-muito-segura
   PORT=3000
   ```

3. Inicie o servidor:
   ```
   npm start
   ```

## Como Usar no Frontend

1. **Login**
   ```javascript
   // Exemplo usando fetch
   const login = async (email) => {
     const response = await fetch('http://localhost:3000/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email })
     });
     
     const data = await response.json();
     
     if (data.success) {
       // Salvar o token no localStorage
       localStorage.setItem('token', data.token);
       localStorage.setItem('usuario', JSON.stringify(data.usuario));
       return true;
     }
     
     return false;
   };
   ```

2. **Verificação de Autenticação**
   ```javascript
   // Verificar se o usuário ainda está autenticado
   const verificarAutenticacao = async () => {
     const token = localStorage.getItem('token');
     
     if (!token) return false;
     
     try {
       const response = await fetch('http://localhost:3000/auth/verificar', {
         headers: {
           'Authorization': `Bearer ${token}`
         }
       });
       
       const data = await response.json();
       return data.valido;
     } catch (error) {
       localStorage.removeItem('token');
       localStorage.removeItem('usuario');
       return false;
     }
   };
   ```

3. **Acesso ao Dashboard**
   ```javascript
   // Exemplo de acesso a rota protegida
   const acessarDashboard = async () => {
     const token = localStorage.getItem('token');
     
     if (!token) return null;
     
     const response = await fetch('http://localhost:3000/dashboard', {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     
     return await response.json();
   };
   ```

4. **Logout Manual**
   ```javascript
   // Função para logout
   const logout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('usuario');
     // Redirecionar para página de login
   };
   ``` 