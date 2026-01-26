const API_BASE_URL = "http://172.16.50.19:2500/api";
//const API_BASE_URL = "https://2583f0184a9a.ngrok-free.app/api";

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadDashboardData();
});

// 1. NAVEGAÇÃO ENTRE ABAS
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar nav ul li');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(s => {
                s.classList.remove('active');
                if (s.id === target) s.classList.add('active');
            });

            if (target === 'users') loadUsers();
            if (target === 'cargos') loadCargos();
            if (target === 'entidades') loadEntidades();
            if (target === 'glpi') loadGlpiData();
            if (target === 'dash') loadDashboardData();
        });
    });
}

// 2. CARREGAMENTO DE DADOS (DASHBOARD)
async function loadDashboardData() {
    try {
        const [u, c, comp] = await Promise.all([
            fetch(`${API_BASE_URL}/users`).then(res => res.json()),
            fetch(`${API_BASE_URL}/cargos`).then(res => res.json()),
            fetch(`${API_BASE_URL}/competencias`).then(res => res.json())
        ]);
        document.getElementById('count-users').innerText = u.length || 0;
        document.getElementById('count-cargos').innerText = c.length || 0;
        document.getElementById('count-comp').innerText = comp.length || 0;
    } catch (err) { console.error("Erro dashboard:", err); }
}

// --- NOVA SEÇÃO: ENTIDADES E PRIORIDADE ---

async function loadEntidades() {
    const tbody = document.getElementById('table-entidades-body');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px;">Carregando entidades do GLPI...</td></tr>';
    
    try {
        // Buscamos as entidades (Proxy GLPI) e as configurações salvas (Local)
        const [resGlpi, resLocal] = await Promise.all([
            fetch(`${API_BASE_URL}/glpi/entidades`),
            fetch(`${API_BASE_URL}/entidades-config`)
        ]);

        const entidadesGlpi = await resGlpi.json();
        const entidadesLocal = await resLocal.json();

        tbody.innerHTML = entidadesGlpi.map(ent => {
            // Verifica se essa entidade já tem configuração de prioridade no nosso banco
            const configLocal = entidadesLocal.find(l => l._id === ent.id);
            const prioridade = configLocal ? configLocal.prioridade : 'Não def.';
            const badgeClass = configLocal ? `priority-badge-${configLocal.prioridade}` : 'priority-badge-none';

            return `
                <tr>
                    <td>${ent.id}</td>
                    <td><strong>${ent.nome}</strong></td>
                    <td style="text-align: center;">
                        <span class="badge-priority ${badgeClass}">${prioridade}</span>
                    </td>
                    <td style="text-align: center;">
                        <button onclick='openPriorityModal(${JSON.stringify(ent)}, ${JSON.stringify(configLocal || null)})' class="btn-action edit">
                            <i class="bi bi-gear-fill"></i> Configurar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) { 
        tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar entidades.</td></tr>'; 
    }
}

// Lógica para abrir o modal de prioridade
window.openPriorityModal = (ent, config) => {
    document.getElementById('pri-entidade-id').value = ent.id;
    document.getElementById('pri-entidade-nome').value = ent.nome;
    
    const inputValor = document.getElementById('pri-valor');
    const labelValor = document.getElementById('label-pri-valor');
    const textMatriz = document.getElementById('pri-matriz-config');

    // Se já existir configuração, preenche, senão volta ao padrão
    if (config) {
        inputValor.value = config.prioridade;
        labelValor.innerText = config.prioridade;
        textMatriz.value = config.matriz_config || '';
    } else {
        inputValor.value = 3;
        labelValor.innerText = 3;
        textMatriz.value = '';
    }

    document.getElementById('modal-prioridade').style.display = 'flex';
};

// Listener para o Slider de prioridade (mudar o número em tempo real)
document.getElementById('pri-valor')?.addEventListener('input', (e) => {
    document.getElementById('label-pri-valor').innerText = e.target.value;
});

// Submit do formulário de prioridade
document.getElementById('form-prioridade').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        _id: Number(document.getElementById('pri-entidade-id').value),
        nome: document.getElementById('pri-entidade-nome').value,
        prioridade: Number(document.getElementById('pri-valor').value),
        matriz_config: document.getElementById('pri-matriz-config').value
    };

    const res = await fetch(`${API_BASE_URL}/entidades-config`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        closeModal('modal-prioridade');
        loadEntidades();
    }
};

// --- MANTENDO AS OUTRAS FUNÇÕES (TECNICOS, CARGOS, ETC) ---

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();
        const tbody = document.getElementById('table-users-body');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td><strong>${user.nome}</strong></td>
                <td><span class="badge-glpi">${user.userNameGlpi}</span></td>
                <td>${user.cargo ? user.cargo.nome : '<span class="text-danger">Sem Cargo</span>'}</td>
                <td>${user.telefone || '-'}</td>
                <td>
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button onclick="openEditUserModal('${user._id}')" class="btn-action edit" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button onclick="deleteUser('${user._id}')" class="btn-action delete" title="Excluir">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function loadCargos() {
    try {
        const response = await fetch(`${API_BASE_URL}/cargos`);
        const cargos = await response.json();
        const container = document.getElementById('cargos-container');
        container.innerHTML = cargos.map(cargo => `
            <div class="card-cargo">
                <div class="card-header">
                    <h3>${cargo.nome}</h3>
                    <div style="display: flex; gap: 5px;">
                        <button onclick="openEditCargoModal('${cargo._id}')" class="btn-action edit" style="width: 30px; height: 30px; font-size: 0.8rem;">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button onclick="deleteCargo('${cargo._id}')" class="btn-action delete-sm">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
                <p>${cargo.descricao || 'Sem descrição definida.'}</p>
                <div class="comp-list">
                    ${cargo.competencias.map(c => `<span>${c.name}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

async function loadGlpiData() {
    const tbody = document.getElementById('table-glpi-body');
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 40px;">Consultando GLPI...</td></tr>';
    try {
        const res = await fetch(`${API_BASE_URL}/glpi/tecnicos`);
        const tecs = await res.json();
        tbody.innerHTML = tecs.map(t => `
            <tr>
                <td>${t.nome} ${t.sobrenome}</td>
                <td>${t.email || '-'}</td>
                <td><small>${t.entidade}</small></td>
                <td style="text-align: center;">
                    <button class="btn-import-glpi" onclick='openImportModal(${JSON.stringify(t)})'>
                        <i class="bi bi-plus-circle"></i> Importar
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) { tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar dados do GLPI.</td></tr>'; }
}

// 3. LÓGICA DE CARGOS (Criação e Edição)
document.getElementById('btn-add-cargo').onclick = async () => {
    const res = await fetch(`${API_BASE_URL}/competencias`);
    const comps = await res.json();
    const container = document.getElementById('lista-competencias-select');
    container.innerHTML = comps.map(c => `
        <label><input type="checkbox" name="comp" value="${c._id}"> ${c.name}</label>
    `).join('');
    document.getElementById('modal-cargo').style.display = 'flex';
};

document.getElementById('form-cargo').onsubmit = async (e) => {
    e.preventDefault();
    const selected = Array.from(document.querySelectorAll('input[name="comp"]:checked')).map(cb => Number(cb.value));
    const data = {
        nome: document.getElementById('cargo-nome').value,
        descricao: document.getElementById('cargo-desc').value,
        competencias: selected
    };
    await fetch(`${API_BASE_URL}/cargos`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    closeModal('modal-cargo');
    loadCargos();
    loadDashboardData();
};

window.openEditCargoModal = async (id) => {
    try {
        const [resCargo, resComps] = await Promise.all([
            fetch(`${API_BASE_URL}/cargos/${id}`),
            fetch(`${API_BASE_URL}/competencias`)
        ]);
        const cargo = await resCargo.json();
        const todasComps = await resComps.json();

        document.getElementById('edit-cargo-id').value = cargo._id;
        document.getElementById('edit-cargo-nome').value = cargo.nome;
        document.getElementById('edit-cargo-desc').value = cargo.descricao || '';

        const idsPossuidos = cargo.competencias.map(c => c._id);
        const container = document.getElementById('edit-lista-competencias');
        container.innerHTML = todasComps.map(c => `
            <label>
                <input type="checkbox" name="edit-comp" value="${c._id}" 
                ${idsPossuidos.includes(c._id) ? 'checked' : ''}> ${c.name}
            </label>
        `).join('');

        document.getElementById('modal-edit-cargo').style.display = 'flex';
    } catch (err) { alert("Erro ao carregar dados do cargo."); }
};

document.getElementById('form-edit-cargo').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-cargo-id').value;
    const selected = Array.from(document.querySelectorAll('input[name="edit-comp"]:checked')).map(cb => Number(cb.value));
    
    const payload = {
        nome: document.getElementById('edit-cargo-nome').value,
        descricao: document.getElementById('edit-cargo-desc').value,
        competencias: selected
    };

    const res = await fetch(`${API_BASE_URL}/cargos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        closeModal('modal-edit-cargo');
        loadCargos();
        loadUsers(); 
        loadDashboardData();
    }
};

window.openImportModal = async (tec) => {
    document.getElementById('user-nome').value = tec.nome + " " + tec.sobrenome;
    document.getElementById('user-id').value = tec.id;
    
    const res = await fetch(`${API_BASE_URL}/cargos`);
    const cargos = await res.json();
    const select = document.getElementById('user-cargo-select');
    select.innerHTML = '<option value="">Selecione um Cargo</option>' + 
                      cargos.map(c => `<option value="${c._id}">${c.nome}</option>`).join('');
    
    document.getElementById('form-user').dataset.login = tec.login;
    document.getElementById('modal-user').style.display = 'flex';
};

document.getElementById('form-user').onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
        _id: document.getElementById('user-id').value,
        nome: document.getElementById('user-nome').value,
        entidade: document.getElementById('user-entidade').value,
        userNameGlpi: e.target.dataset.login,
        cargo: document.getElementById('user-cargo-select').value
    };

    const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    });

    if(res.ok) {
        closeModal('modal-user');
        loadUsers();
        loadDashboardData();
    }
};

// ... (código anterior igual)

// 4. LÓGICA DE IMPORTAÇÃO DE USUÁRIO (Alterada para incluir entidade)
window.openImportModal = async (tec) => {
    document.getElementById('user-nome').value = tec.nome + " " + tec.sobrenome;
    document.getElementById('user-id').value = tec.id;
    
    // LINHA ADICIONADA: Preenche o campo 'user-entidade' que adicionamos ao HTML
    const fieldEntidade = document.getElementById('user-entidade');
    if (fieldEntidade) {
        fieldEntidade.value = tec.entidade || '';
    }
    
    const res = await fetch(`${API_BASE_URL}/cargos`);
    const cargos = await res.json();
    const select = document.getElementById('user-cargo-select');
    select.innerHTML = '<option value="">Selecione um Cargo</option>' + 
                      cargos.map(c => `<option value="${c._id}">${c.nome}</option>`).join('');
    
    document.getElementById('form-user').dataset.login = tec.login;
    document.getElementById('modal-user').style.display = 'flex';
};

document.getElementById('form-user').onsubmit = async (e) => {
    e.preventDefault();
    
    // Agora o document.getElementById('user-entidade') não retornará mais null
    const payload = {
        _id: document.getElementById('user-id').value,
        nome: document.getElementById('user-nome').value,
        entidade: document.getElementById('user-entidade').value, 
        userNameGlpi: e.target.dataset.login,
        cargo: document.getElementById('user-cargo-select').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            closeModal('modal-user');
            loadUsers();
            loadDashboardData();
        } else {
            const errorData = await res.json();
            alert("Erro ao importar: " + (errorData.message || "Erro desconhecido"));
        }
    } catch (err) {
        console.error("Erro no POST /users:", err);
        alert("Erro de conexão com o servidor.");
    }
};

// ... (restante do código igual)

document.getElementById('form-edit-user').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-user-id').value;
    const payload = {
        nome: document.getElementById('edit-user-nome').value,
        telefone: document.getElementById('edit-user-telefone').value,
        cargo: document.getElementById('edit-user-cargo-select').value
    };

    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        closeModal('modal-edit-user');
        loadUsers();
        loadDashboardData();
    }
};

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

document.getElementById('sync-competencias').onclick = async () => {
    const btn = document.getElementById('sync-competencias');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sincronizando...';
    try {
        await fetch(`${API_BASE_URL}/competencias/sync`);
        alert("Competências sincronizadas com sucesso!");
        document.getElementById('last-sync').innerText = new Date().toLocaleDateString();
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Sincronizar Categorias ITIL';
    }
};

async function deleteUser(id) {
    if (confirm("Tem certeza que deseja excluir este técnico do banco local?")) {
        await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
        loadUsers();
        loadDashboardData();
    }
}

async function deleteCargo(id) {
    if (confirm("Excluir este cargo? Técnicos vinculados ficarão sem cargo.")) {
        await fetch(`${API_BASE_URL}/cargos/${id}`, { method: 'DELETE' });
        loadCargos();
        loadDashboardData();
    }
}