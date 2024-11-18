// ------------------------ CLIENTE -----------------------//
async function cadastrarCliente(){

    const nome_c = document.getElementById('nomecliente').value;
    const cpf_c = document.getElementById('cpf_cliente').value;
    const telefone_c = document.getElementById('telcliente').value;
    const endereco_c = document.getElementById('endereço_cliente').value;
    await fetch('/cadastrar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_c, cpf_c, telefone_c, endereco_c })
    });

    alert("Cliente cadastrado!");
}

// ------------------------ FUNCIONARIO -----------------------// 

async function cadastrarFuncionario() {

    const nome_f = document.getElementById('nome').value;
    const email_f = document.getElementById('email').value;
    const senha_f = document.getElementById('senha').value;
    const confirmar_f = document.getElementById('c_senha').value;
    const tel_f = document.getElementById('telefone').value;
    const cpf_f = document.getElementById('cpf').value;
    
    await fetch('/cadastrar-funcionario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_f, email_f, senha_f, confirmar_f, tel_f, cpf_f })
    });

    alert("Funcionario cadastrado com sucesso! ;D")
} 

// ------------------------ SERVIÇO -----------------------//

async function cadastrarServico(){

    const nome_s = document.getElementById('nome_servico').value
    const tipo_s = document.getElementById('tipo_servico').value
    const preco_s = document.getElementById('preco_servico').value
    const descricao_s = document.getElementById('descricao').value

    await fetch('/cadastrar-servico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_s, tipo_s, preco_s, descricao_s })
    });

    alert("Serviço cadastrado com sucesso")
}

// ------------------------ PET -----------------------//


async function cadastrarPet() {

    const nome_p = document.getElementById('nomePet').value
    const idade_p = document.getElementById('idadePet').value
    const raca_p = document.getElementById('racaPet').value
    const observacoes_p = document.getElementById('observacoesPet').value
    const dono_p = document.getElementById('donoSelecionado').value

    await fetch('/cadastrar-pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_p, idade_p, raca_p, observacoes_p, dono_p })
    });
    
}

async function buscarDono() {
    const buscaDono = document.getElementById('buscaDono').value;
  
    // Se o campo de busca estiver vazio, não faz nada
    if (buscaDono === '') return;
  
    // Faz a busca no servidor
    const response = await fetch(`/buscar-Dono?query=${buscaDono}`);
  
    // Verifica se a resposta foi bem-sucedida
    if (response.ok) {
        const Dono = await response.json();
  
        // Seleciona o dropdown de alunos
        const DonoSelecionado = document.getElementById('donoSelecionado');
        DonoSelecionado.innerHTML = '<option value="">Selecione um Dono do animalzinho</option>';
  
        // Preenche o dropdown com os resultados da busca
        Dono.forEach(Dono => {
            const option = document.createElement('option');
            option.value = Dono.cpf_c;
            option.textContent = `${Dono.nome_c} (CPF: ${Dono.cpf_c})`;
            DonoSelecionado.appendChild(option);
        });
  
    } else {
        alert('Erro ao buscar o Dono. Tente novamente.');
    }
  }

// ------------------------ AGENDAMENTO -----------------------//

async function cadastrarAgendamento() {
    const nome_cliente = document.getElementById('nome_a').value;
    const nome_pet = document.getElementById('nomePet_a').value;
    const tipo_servico = document.getElementById('servico_a').value;
    const dia_agendamento = document.getElementById('dia_a').value;
    const horario_agendamento = document.getElementById('hora_a').value;

    await fetch('/cadastrar-agendamento', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nome_cliente, nome_pet, tipo_servico, dia_agendamento, horario_agendamento })
    });
    alert('Agendamento Cadastrado');
}

// --------------------------CONSULTAAGENDAMENTO-----------------------------//
    
    function consultarAgendamentos(event) {
        event.preventDefault();

        const cliente_consulta = document.getElementById("nome_a").value;
        const nomepet = document.getElementById("nomePet_a").value;
        const dia = document.getElementById("dia_a").value;
         const hora = document.getElementById("hora_a").value;

        const tabelaAgendamentos = document.getElementById("resultadoConsulta").querySelector("tbody");
        tabelaAgendamentos.innerHTML = "";

        const params = new URLSearchParams({
            nome_cliente: cliente_consulta,
            nome_pet: nomepet,
            dia_agendamento: dia,
            horario_agendamento: hora,
        });

        fetch(`/consultar-agendamentos?${params}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na consulta');
                }
                return response.json();
            })
            .then(agendamentos => {
                agendamentos.forEach(agendamento => {
                    const row = tabelaAgendamentos.insertRow();
                    row.insertCell(0).innerText = agendamento.id;
                    row.insertCell(1).innerText = agendamento.dia_agendamento;
                    row.insertCell(2).innerText = agendamento.horario_agendamento;
                    row.insertCell(3).innerText = agendamento.nome_cliente;
                    row.insertCell(4).innerText = agendamento.nome_pet;
                    row.insertCell(5).innerText = agendamento.tipo_servico;


                    const actionsCell = row.insertCell(6);
                    actionsCell.innerHTML = `
                        <button onclick="excluirAgendamento('${agendamento.id}')">Excluir</button>
                        <button onclick="carregarAgendamentoParaEdicao('${agendamento.id}')">Editar</button>
                    `;
                });

                if (agendamentos.length === 0) {
                    const row = tabelaAgendamentos.insertRow();
                    row.insertCell(0).colSpan = 6;
                    row.cells[0].innerText = "Nenhum agendamento encontrado.";
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                const row = tabelaAgendamentos.insertRow();
                row.insertCell(0).colSpan = 6;
                row.cells[0].innerText = "Erro ao consultar agendamentos.";
            });
    }

