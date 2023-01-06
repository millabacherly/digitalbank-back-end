const validacaoDaSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({ mensagem: "Favor informar a senha." });
    }

    if (senha_banco !== "Cubos123Bank") {
        return res.status(400).json({ mensagem: "A senha informada está incorreta." });
    }
    next();
}

module.exports = {
    validacaoDaSenha
}