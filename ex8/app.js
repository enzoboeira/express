import express from 'express';
import pg from 'pg';

const app = express();
const PORT = 3000;

app.use(express.json());

function criarCliente() {
    return new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: 'filmes_db',
        password: 'root',
        port: 5432
    });
}

app.post('/api/filmes', async (req, res) => {
    const { titulo, diretor, ano, nota, duracao, genero_id } = req.body;

    if (!genero_id) {
        return res.status(400).json({
            erro: 'O genero_id é obrigatório'
        });
    }

    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            `INSERT INTO filmes (titulo, diretor, ano, nota, duracao, genero_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [titulo, diretor, ano, nota, duracao, genero_id]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        if (erro.code === '23503') {
            return res.status(400).json({
                erro: 'O gênero informado não existe'
            });
        }

        res.status(500).json({
            erro: 'Erro ao inserir filme'
        });

    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});