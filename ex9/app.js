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

app.get('/api/filmes', async (req, res) => {
    let query = `
        SELECT f.id, f.titulo, f.diretor, f.ano, f.nota, g.nome AS genero
        FROM filmes f
        INNER JOIN generos g ON f.genero_id = g.id
        WHERE 1=1
    `;

    const params = [];

    if (req.query.genero) {
        params.push(req.query.genero);
        query += ` AND g.nome = $${params.length}`;
    }

    if (req.query.ano) {
        params.push(req.query.ano);
        query += ` AND f.ano = $${params.length}`;
    }

    if (req.query.nota_minima) {
        params.push(req.query.nota_minima);
        query += ` AND f.nota >= $${params.length}`;
    }

    query += ` ORDER BY f.titulo`;

    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(query, params);

        res.json(resultado.rows);

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao consultar filmes'
        });

    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});