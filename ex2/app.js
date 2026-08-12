import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const filmes = [
    { id: 1, titulo: 'A Origem', diretor: 'Nolan' },
    { id: 2, titulo: 'Interestelar', diretor: 'Nolan' },
    { id: 3, titulo: 'O Poderoso Chefão', diretor: 'Coppola' }
];

app.get('/api/filmes', (req, res) => {
    const { diretor } = req.query;

    if (diretor) {
        return res.json(
            filmes.filter(filme => filme.diretor === diretor)
        );
    }

    res.json(filmes);
});

app.get('/api/filmes/:id', (req, res) => {
    const id = Number(req.params.id);

    const filme = filmes.find(filme => filme.id === id);

    if (!filme) {
        return res.status(404).json({
            erro: 'Filme não encontrado'
        });
    }

    res.json(filme);
});

app.post('/api/filmes', (req, res) => {
    const { titulo, diretor } = req.body;

    const novoFilme = {
        id: filmes.length + 1,
        titulo,
        diretor
    };

    filmes.push(novoFilme);

    res.status(201).json(novoFilme);
});

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// 1. Qual a diferença entre req.params.id e req.query.diretor?
// Resposta: req.params.id pega um parâmetro da URL, enquanto req.query.diretor pega um parâmetro de consulta.

// 2. Por que express.json() precisa vir antes das rotas?
// Resposta: Para que o Express consiga interpretar o JSON enviado no body e disponibilizá-lo em req.body.

// 3. O que acontece se você não chamar next() dentro de um middleware?
// Resposta: A requisição fica parada e não passa para o próximo middleware ou rota.