const API_BASE_URL = "http://172.16.50.19:2500/api";

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Carregado - Login Page');
    
    // Verificar se já está logado
    const token = localStorage.getItem('mcp_token');
    if (token) {
        window.location.href = '/index.html';
        return;
    }

    // Toggle de senha
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            }
        });
    }

    // Submit do formulário
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Focus automático no campo de usuário
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.focus();
    }
});

async function handleLogin(e) {
    e.preventDefault();
    console.log('Tentando login...');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const btnLogin = document.getElementById('btn-login');
    const errorMessage = document.getElementById('error-message');
    
    // Validações básicas
    if (!username || !password) {
        showError('Por favor, preencha todos os campos');
        return;
    }
    
    // Desabilitar botão
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<i class="bi bi-hourglass-split"></i> Autenticando...';
    errorMessage.classList.remove('show');
    
    try {
        console.log('Fazendo requisição para:', `${API_BASE_URL}/auth/login`);
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        console.log('Resposta recebida:', response.status);
        
        if (response.ok) {
            console.log('Login bem-sucedido!');
            // Salvar token e dados do usuário
            localStorage.setItem('mcp_token', data.token);
            localStorage.setItem('mcp_user', JSON.stringify(data.user));
            
            // Redirecionar para dashboard
            window.location.href = '/index.html';
        } else {
            showError(data.message || 'Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showError('Erro ao conectar com o servidor. Verifique se a API está rodando.');
    } finally {
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Entrar';
    }
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    if (errorText) {
        errorText.textContent = message;
    }
    
    if (errorMessage) {
        errorMessage.classList.add('show');
        
        // Remover erro após 5 segundos
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}