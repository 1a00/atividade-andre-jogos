const express = require('express');
const router = express.Router();

const validarJogo = require('../middleware/validarJogo');

let jogos = [];
let proximoId = 1;

// GET /jogos
// Lista todos os jogos ou aplica filtros
router.get('/', (req, res) => {
    const { titulo, genero } = req.query;

    let resultado = jogos;

    if (titulo) {
        resultado = resultado.filter(jogo =>
            jogo.titulo.toLowerCase().includes(titulo.toLowerCase())
        );
    }

    if (genero) {
        resultado = resultado.filter(jogo =>
            jogo.genero.toLowerCase().includes(genero.toLowerCase())
        );
    }

    res.status(200).json(resultado);
});

// GET /jogos/:id
// Consulta um jogo específico
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'O ID deve ser um número inteiro positivo.'
        });
    }

    const jogo = jogos.find(j => j.id === id);

    if (!jogo) {
        return res.status(404).json({
            erro: 'Jogo não encontrado.'
        });
    }

    res.status(200).json(jogo);
});

// POST /jogos
// Cadastra um jogo
router.post('/', validarJogo, (req, res) => {
    const jogo = {
        id: proximoId++,
        titulo: req.body.titulo.trim(),
        plataforma: req.body.plataforma.trim(),
        genero: req.body.genero.trim(),
        anoLancamento: req.body.anoLancamento
    };

    jogos.push(jogo);

    res.status(201).json(jogo);
});

// PUT /jogos/:id
// Atualiza um jogo
router.put('/:id', validarJogo, (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'O ID deve ser um número inteiro positivo.'
        });
    }

    const jogo = jogos.find(j => j.id === id);

    if (!jogo) {
        return res.status(404).json({
            erro: 'Jogo não encontrado.'
        });
    }

    jogo.titulo = req.body.titulo.trim();
    jogo.plataforma = req.body.plataforma.trim();
    jogo.genero = req.body.genero.trim();
    jogo.anoLancamento = req.body.anoLancamento;

    res.status(200).json(jogo);
});

// DELETE /jogos/:id
// Remove um jogo
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: 'O ID deve ser um número inteiro positivo.'
        });
    }

    const indice = jogos.findIndex(j => j.id === id);

    if (indice === -1) {
        return res.status(404).json({
            erro: 'Jogo não encontrado.'
        });
    }

    jogos.splice(indice, 1);

    res.status(204).send();
});

module.exports = router;
