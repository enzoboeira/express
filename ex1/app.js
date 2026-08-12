import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        sistema: 'Filmes API'
    });
});

app.get('/api/saude', (req, res) => {
    res.json({
        status: 'ok',
        data: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});