const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

const db = new sqlite3.Database('agendamento.db');

db.serialize(() => {

  // TABELA CLIENTE
  db.run(`
      CREATE TABLE IF NOT EXISTS cliente(
        id_cliente integer PRIMARY KEY AUTOINCREMENT,
        nome varchar(100) NOT NULL,
        cpf text not NULL,
        telefone text not null,
        endereco text
        )
  `, (err) => {
      if (err) {
          console.error('Erro ao criar tabela Cliente:', err);
      } else {
          console.log('Tabela Cliente criada com sucesso (ou já existe).');
      }
  });

  // TABELA FUNCIONARIO
  db.run(`
     CREATE TABLE IF NOT EXISTS funcionario(
       id_funcionario integer primary key AUTOINCREMENT,
       nome varchar(100) NOT NULL,
       cpf numeric(20) NOT NULL,
       senha text NOT NULL,
       confirmar_senha text NOT NULL,
       telefone numeric(20) NOT NULL,
       email text NOT NULL
      )
  `, (err) => {
      if (err) {
          console.error('Erro ao criar tabela Funcionario:', err);
      } else {
          console.log('Tabela Funcionario criada com sucesso (ou já existe).');
      }
  });

  // TABELA PET
  db.run(`
     CREATE TABLE IF NOT EXISTS pet(
       id_pet integer PRIMARY KEY AUTOINCREMENT,
       nome varchar(100) NOT NULL,
       idade integer,
       raca text,
       observacoes text,
       cpf_cliente text NOT NULL, 
       FOREIGN KEY (cpf_cliente) REFERENCES cliente(cpf) 
       )
  `, (err) => {
      if (err) {
          console.error('Erro ao criar tabela Pet:', err);
      } else {
          console.log('Tabela Pet criada com sucesso (ou já existe).');
      }
  });

  // TABELA SERVIÇO
  db.run(`
     CREATE TABLE IF NOT EXISTS servico(
       id_servico integer primary key AUTOINCREMENT,
       nome varchar(30),
       tipo_servico text,
       preco real,
       descricao text
       )
  `, (err) => {
      if (err) {
          console.error('Erro ao criar tabela serviço:', err);
      } else {
          console.log('Tabela serviço criada com sucesso (ou já existe).');
      }
  });

  // TABELA AGENDAMENTO
  db.run(`
     CREATE TABLE IF NOT EXISTS agenda (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         data TEXT NOT NULL,
         horario TEXT NOT NULL,
         cpf_cliente TEXT NOT NULL,
         nome_pet TEXT NOT NULL,
         nome_servico TEXT NOT NULL,
         FOREIGN KEY(cpf_cliente) REFERENCES cliente(cpf),
         FOREIGN KEY(nome_pet) REFERENCES pet(nome),
         FOREIGN KEY (nome_servico) REFERENCES servico(nome)
     )
  `, (err) => {
      if (err) {
          console.error('Erro ao criar tabela Agenda:', err);
      } else {
          console.log('Tabela Agenda criada com sucesso (ou já existe).');
      }
  });

});

// ROTA PRA CADASTRAR UM CLIENTE
app.post('/cadastrar-cliente', (req, res) => {
    const { nome_c, cpf_c, telefone_c, endereco_c } = req.body;
    db.run("INSERT INTO cliente (nome, cpf, telefone, endereco) VALUES (?, ?, ?, ?)", [nome_c, cpf_c, telefone_c, endereco_c], function (err) {
        if (err) {
            console.error('Erro ao cadastrar cliente:', err);
            res.status(500).send('Erro ao cadastrar cliente');
        } else {
            res.send('Cliente cadastrado com sucesso!');
        }
    });
});

// ROTA PRA CADASTRAR UM FUNCIONARIO
app.post('/cadastrar-funcionario', (req, res) => {
    const { nome_f, email_f, senha_f, confirmar_f, tel_f, cpf_f } = req.body;
    db.run("INSERT INTO funcionario (nome, cpf, senha, telefone, email) VALUES (?, ?, ?, ?, ?)", [nome_f, cpf_f, senha_f, confirmar_f, tel_f, email_f], function (err) {
        if (err) {
            console.error('Erro ao cadastrar funcionario:', err);
            res.status(500).send('Erro ao cadastrar funcionario');
        } else {
            res.send('Funcionario cadastrado com sucesso!');
        }
    });
});

// ROTA PRA CADASTRAR UM PET
app.post('/cadastrar-pet', (req, res) => {
    const { nome_p, idade_p, raca_p, observacoes_p, dono_p } = req.body;
    db.run("INSERT INTO pet (nome, idade, raca, observacoes, cpf_cliente) VALUES (?, ?, ?, ?, ?)", [nome_p, idade_p, raca_p, observacoes_p, dono_p], function (err) {
        if (err) {
            console.error('Erro ao cadastrar Pet:', err);
            res.status(500).send('Erro ao cadastrar Pet');
        } else {
            res.send('Pet cadastrado com sucesso!');
        }
    });
});

// ROTA PRA CADASTRAR UM SERVIÇO
app.post('/cadastrar-servico', (req, res) => {
    const { nome_s, tipo_s, preco_s, descricao_s } = req.body;
    db.run("INSERT INTO servico (nome, tipo_servico, preco, descricao) VALUES (?, ?, ?, ?)", [nome_s, tipo_s, preco_s, descricao_s], function (err) {
        if (err) {
            console.error('Erro ao cadastrar Serviço:', err);
            res.status(500).send('Erro ao cadastrar Serviço');
        } else {
            res.send('Serviço cadastrado com sucesso!');
        }
    });
});

// ROTA PRA CADASTRAR AGENDAMENTO
app.post('/cadastrar-agendamento', (req, res) => {
    const { data, horario, nome_cliente, nome_pet, nome_servico } = req.body;
    db.run("INSERT INTO agenda (data, horario, cpf_cliente, nome_pet, nome_servico) VALUES (?, ?, ?, ?, ?)", [data, horario, nome_cliente, nome_pet, nome_servico], function (err) {
        if (err) {
            console.error('Erro ao cadastrar Agendamento:', err);
            res.status(500).send('Erro ao cadastrar Agendamento');
        } else {
            res.send('Agendamento cadastrado com sucesso!');
        }
    });
});

// ROTA PARA CONSULTAR AGENDAMENTOS
app.get('/consultar-agendamentos', (req, res) => {
    const { dia_agendamento, nome_cliente, nome_pet, horario_agendamento } = req.query;

    let sql = "SELECT * FROM agenda WHERE 1=1";
    const params = [];

    if (dia_agendamento) {
        sql += " AND data = ?";
        params.push(dia_agendamento);
    }
    if (nome_cliente) {
        sql += " AND nome_cliente = ?";
        params.push(nome_cliente);
    }
    if (nome_pet) {
        sql += " AND nome_pet = ?";
        params.push(nome_pet);
    }
    if (horario_agendamento) {
        sql += " AND horario = ?";
        params.push(horario_agendamento);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar agendamentos:', err);
            return res.status(500).send('Erro ao consultar agendamentos.');
        }
        res.json(rows);
    });
});

// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
