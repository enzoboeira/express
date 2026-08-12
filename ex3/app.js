import express from 'express';
import pg from 'pg';

const app = express();
const PORT = 3000;

function criarCliente() {
    return new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: 'filmes_db',
        password: 'root',
        port: 5432
    });
}

app.get('/api/filmes', async (req, res) => {
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            'SELECT * FROM filmes ORDER BY titulo'
        );

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao consultar o banco de dados'
        });
    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Pergunta: Por que usamos try/catch/finally em vez de só try/catch?
// Resposta: Porque o finally sempre é executado, mesmo quando acontece um erro,
// garantindo que a conexão com o banco seja encerrada.

// Pergunta: O que aconteceria com a conexão se houvesse um erro e não tivéssemos o finally?
// Resposta: A conexão poderia permanecer aberta, consumindo recursos e podendo
// causar problemas com várias conexões abertas ao mesmo tempo.