import express from 'express';
import pg from 'pg';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'filmes_db',
    password: 'root',
    port: 5432
});

app.get('/api/filmes', async (req, res) => {
    try {
        let query = `
            SELECT
                f.id,
                f.titulo,
                f.diretor,
                f.ano,
                f.nota,
                g.nome AS genero
            FROM filmes f
            INNER JOIN generos g ON f.genero_id = g.id
        `;

        const valores = [];

        if (req.query.genero) {
            valores.push(req.query.genero);

            query += `
                WHERE g.nome = $1
            `;
        }

        query += `
            ORDER BY f.titulo
        `;

        const resultado = await pool.query(query, valores);

        res.json(resultado.rows);

    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao consultar filmes'
        });
    }
});

app.get('/api/generos', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT id, nome FROM generos ORDER BY nome'
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao consultar gêneros'
        });
    }
});

app.delete('/api/filmes/:id', async (req, res) => {
    const id = Number(req.params.id);

    try {
        const resultado = await pool.query(
            `
            DELETE FROM filmes
            WHERE id = $1
            RETURNING titulo
            `,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Filme não encontrado'
            });
        }

        res.json({
            titulo: resultado.rows[0].titulo
        });

    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao remover filme'
        });
    }
});

app.put('/api/filmes/:id', async (req, res) => {
    const id = Number(req.params.id);
    const nota = Number(req.body.nota);

    if (isNaN(nota) || nota < 0 || nota > 10) {
        return res.status(400).json({
            erro: 'A nota deve estar entre 0 e 10'
        });
    }

    try {
        const resultado = await pool.query(
            `
            UPDATE filmes
            SET nota = $1
            WHERE id = $2
            RETURNING nota
            `,
            [nota, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Filme não encontrado'
            });
        }

        res.json({
            nota: resultado.rows[0].nota
        });

    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar nota'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
