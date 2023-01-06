let { contas, depositos, saques, transferencias } = require('../bancodedados')
const { format } = require('date-fns');

const deposito = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta) {
        return res.status(403).json({ "mensagem": "O número da conta é obrigatório" });
    }

    if (!valor) {
        return res.status(403).json({ "mensagem": "O valor do depósito é obrigatório!" })
    }

    const localizarConta = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta);
    });

    if (!localizarConta) {
        return res.status(404).json({ "mensagem": "A conta solicitada não foi localizada." })
    }

    if (valor <= 0) {
        return res.status(404).json({ "mensagem": "O valor é obrigatório" })
    };

    localizarConta.saldo += valor;

    const registroDaTransacao = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    };

    depositos.push(registroDaTransacao);

    return res.status(200).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta) {
        return res.status(403).json({ "mensagem": "O número da conta é obrigatório" });
    }

    if (valor <= 0) {
        return res.status(403).json({ "mensagem": "Favor declarar um valor válido!" })
    }

    if (!senha) {
        return res.status(400).json({ "mensagem": "A senha informada não é válida." })
    }

    const localizarConta = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta);
    });

    if (!localizarConta) {
        return res.status(404).json({ "mensagem": "A conta solicitada não foi localizada." })
    }

    if (valor > localizarConta.saldo) {
        return res.status(404).json({ "mensagem": "Saldo insuficiênte para realizar a transação." })
    };

    localizarConta.saldo -= valor;

    const registroDaTransacao = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor,
        senha
    };

    saques.push(registroDaTransacao);

    return res.status(200).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        return res.status(403).json({ "mensagem": "O número da conta é obrigatório" });
    }

    if (valor <= 0) {
        return res.status(403).json({ "mensagem": "Favor declarar um valor válido!" })
    }

    if (!senha) {
        return res.status(400).json({ "mensagem": "A senha informada não é válida." })
    }

    const localizarContaOrigem = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta_origem);
    });

    const localizarContaDestino = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta_destino);
    })

    if (!localizarContaOrigem) {
        return res.status(404).json({ "mensagem": "A conta de origem não foi localizada." })
    }

    if (!localizarContaDestino) {
        return res.status(404).json({ "mensagem": "A conta de destino não foi localizada." })
    }

    if (valor > localizarContaOrigem.saldo) {
        return res.status(404).json({ "mensagem": "Saldo insuficiênte para realizar a transação." })
    };

    localizarContaOrigem.saldo -= valor;
    localizarContaDestino.saldo += valor;

    const registroDaTransacao = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor,
        senha
    };

    transferencias.push(registroDaTransacao);

    return res.status(200).send();
}

const saldoDaConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        console.log(numero_conta);
        return res.status(403).json({ "mensagem": "O número da conta é obrigatório" });
    }

    if (!senha) {
        return res.status(400).json({ "mensagem": "A senha informada não é válida." })
    }

    const localizarConta = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta);
    });

    if (!localizarConta) {
        return res.status(404).json({ "mensagem": "A conta solicitada não foi localizada." })
    }

    return res.status(200).json({ "saldo": `${localizarConta.saldo}` });
}

const extratoDaConta = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        console.log(numero_conta);
        return res.status(403).json({ "mensagem": "O número da conta é obrigatório" });
    }

    if (!senha) {
        return res.status(400).json({ "mensagem": "A senha informada não é válida." })
    }

    const localizarConta = contas.find((cliente) => {
        return cliente.numero === Number(numero_conta);
    });

    if (!localizarConta) {
        return res.status(404).json({ "mensagem": "A conta solicitada não foi localizada." })
    }

    const depositosNaConta = depositos.filter(entradas => {
        return entradas.numero_conta === numero_conta;
    })
    const saquesNaConta = saques.filter(saidas => {
        return saidas.numero_conta === numero_conta;
    })
    const transferenciasEnviadas = transferencias.filter(transferenciaEnviada => {
        return transferenciaEnviada.numero_conta_origem === numero_conta;
    })
    const transferenciasRecebidas = transferencias.filter(transferenciaRecebida => {
        return transferenciaRecebida.numero_conta_destino === numero_conta;
    })

    return res.status(200).json({ depositosNaConta, saquesNaConta, transferenciasEnviadas, transferenciasRecebidas });

}

module.exports = { deposito, sacar, transferir, saldoDaConta, extratoDaConta };
