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

app.get('/api/filmes/:id', async (req, res) => {
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            'SELECT * FROM filmes WHERE id = $1',
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Filme não encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);

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