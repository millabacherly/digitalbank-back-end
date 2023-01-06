const express = require('express');
const { listarContas, criarConta, alterarConta, deletarConta } = require('./controladores/contas');
const { deposito, sacar, transferir, saldoDaConta, extratoDaConta } = require('./controladores/transacoes');
const { validacaoDaSenha } = require("./intermediarios");

const rotas = express();

rotas.use(validacaoDaSenha);
rotas.get('/contas', listarContas);
rotas.post('/contas', criarConta);
rotas.put('/contas/:numeroConta/usuario', alterarConta);
rotas.delete('/contas/:numeroConta', deletarConta);

rotas.post('/transacoes/depositar', deposito);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);

rotas.get('/contas/saldo', saldoDaConta);
rotas.get('/contas/extrato', extratoDaConta);


module.exports = rotas;