let { contas } = require('../bancodedados');

function listarContas(req, res) {
    return res.send(contas);
};

let cadastroDeCliente = 1;

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." })
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: "O campo cpf é obrigatório." })
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "O campo data de nascimento é obrigatório." })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O campo telefone é obrigatório." })
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O campo e-mail é obrigatório." })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório." })
    }

    const validaCPF = contas.find(conta => {
        return conta.usuario.cpf === cpf;
    });

    const validaEmail = contas.find(email => {
        return email.usuario.email === email;
    });

    if (validaCPF ?? validaEmail) {
        return res.status(409).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })
    };

    const novaConta = {
        numero: cadastroDeCliente++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta);
    return res.status(201).json(novaConta);
}

const alterarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório." })
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: "O campo cpf é obrigatório." })
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "O campo data de nascimento é obrigatório." })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O campo telefone é obrigatório." })
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O campo e-mail é obrigatório." })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório." })
    }

    const validaCPF = contas.find(conta => {
        return conta.usuario.cpf === cpf;
    });

    const validaEmail = contas.find(email => {
        return email.usuario.email === email;

    });

    if (validaCPF ?? validaEmail) {
        return res.status(409).json({ "mensagem": "Já existe uma conta com o E-mail informado!" })
    };

    const verificarDados = contas.find(conta => conta.numero === Number(numeroConta));

    if (!verificarDados) {
        return res.status(401).json({ "mensagem": "A conta selecionada não foi localizada." })
    }

    verificarDados.usuario.nome = nome;
    verificarDados.usuario.cpf = cpf;
    verificarDados.usuario.data_nascimento = data_nascimento
    verificarDados.usuario.telefone = telefone;
    verificarDados.usuario.email = email;
    verificarDados.usuario.senha = senha

    return res.status(204).send();
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const localizarConta = contas.find((cliente) => {
        return cliente.numero === Number(numeroConta);
    })

    if (!localizarConta) {
        return res.status(401).json({ "mensagem": "O número da conta não foi localizado" });
    }

    if (localizarConta.saldo !== 0) {
        return res.status(401).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    }

    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    });

    return res.status(204).send();

}

module.exports = { listarContas, criarConta, alterarConta, deletarConta };