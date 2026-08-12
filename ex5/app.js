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
    const { titulo, diretor, ano, nota, duracao } = req.body;

    if (!titulo || titulo.trim() === '') {
        return res.status(400).json({
            erro: 'O título é obrigatório'
        });
    }

    if (!diretor || diretor.trim() === '') {
        return res.status(400).json({
            erro: 'O diretor é obrigatório'
        });
    }

    if (nota !== undefined && (nota < 0 || nota > 10)) {
        return res.status(400).json({
            erro: 'A nota deve estar entre 0 e 10'
        });
    }

    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            `INSERT INTO filmes (titulo, diretor, ano, nota, duracao)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [titulo, diretor, ano, nota, duracao]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao inserir filme no banco de dados'
        });

    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});k