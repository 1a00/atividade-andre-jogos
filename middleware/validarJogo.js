const validarJogo = (req, res, next) => {
    const { titulo, plataforma, genero, anoLancamento } = req.body;

    if (!titulo || !titulo.trim()) {
        return res.status(400).json({
            erro: 'O título é obrigatório.'
        });
    }

    if (!plataforma || !plataforma.trim()) {
        return res.status(400).json({
            erro: 'A plataforma é obrigatória.'
        });
    }

    if (!genero || !genero.trim()) {
        return res.status(400).json({
            erro: 'O gênero é obrigatório.'
        });
    }

    if (!Number.isInteger(anoLancamento)) {
        return res.status(400).json({
            erro: 'O ano de lançamento deve ser um número inteiro.'
        });
    }

    next();
};

module.exports = validarJogo;
