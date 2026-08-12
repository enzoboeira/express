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

app.put('/api/filmes/:id', async (req, res) => {
    const { titulo, diretor, ano, nota, duracao } = req.body;
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            `UPDATE filmes
             SET titulo = COALESCE($1, titulo),
                 diretor = COALESCE($2, diretor),
                 ano = COALESCE($3, ano),
                 nota = COALESCE($4, nota),
                 duracao = COALESCE($5, duracao)
             WHERE id = $6
             RETURNING *`,
            [titulo, diretor, ano, nota, duracao, req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Filme não encontrado'
            });
        }

        res.status(200).json(resultado.rows[0]);

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao atualizar filme'
        });

    } finally {
        await client.end();
    }
});

app.delete('/api/filmes/:id', async (req, res) => {
    const client = criarCliente();

    try {
        await client.connect();

        const resultado = await client.query(
            `DELETE FROM filmes
             WHERE id = $1
             RETURNING titulo`,
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Filme não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Filme removido com sucesso',
            titulo: resultado.rows[0].titulo
        });

    } catch (erro) {
        res.status(500).json({
            erro: 'Erro ao remover filme'
        });

    } finally {
        await client.end();
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});