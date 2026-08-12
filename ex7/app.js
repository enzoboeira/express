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
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(`
            SELECT
                f.id,
                f.titulo,
                f.diretor,
                f.ano,
                f.nota,
                g.nome AS genero
            FROM filmes f
            INNER JOIN generos g ON f.genero_id = g.id
            ORDER BY f.titulo
        `);

        res.json(resultado.rows);

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao consultar filmes'
        });

    } finally {
        await client.end();
    }
});

app.get('/api/filmes/:id', async (req, res) => {
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(`
            SELECT
                f.id,
                f.titulo,
                f.diretor,
                f.ano,
                f.nota,
                f.duracao,
                g.nome AS genero
            FROM filmes f
            INNER JOIN generos g ON f.genero_id = g.id
            WHERE f.id = $1
        `, [req.params.id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Filme não encontrado'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao consultar filme'
        });

    } finally {
        await client.end();
    }
});

app.get('/api/generos', async (req, res) => {
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            'SELECT * FROM generos ORDER BY nome'
        );

        res.json(resultado.rows);

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao consultar gêneros'
        });

    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Pergunta: Por que o SELECT * FROM filmes não é suficiente agora?
// Resposta: Porque ele mostra apenas o genero_id, e não o nome do gênero.

// Pergunta: O que o JOIN resolve?
// Resposta: O JOIN relaciona as tabelas filmes e generos e permite mostrar o nome do gênero.