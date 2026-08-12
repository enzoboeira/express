import express from 'express';
import pkg from 'pg';
const { Client } = pkg;

const app = express();
app.use(express.json());
app.use(express.static('public'));

function criarCliente() {
    return new Client({
        host:     'localhost',
        port:     5432,
        user:     'postgres',
        password: 'root',
        database: 'loja_db'
    });
}

app.get('/api/produtos', async (req, res) => {
    const client = criarCliente();
    try {
        await client.connect();

        const resultado = await client.query(`
            SELECT
                p.id,
                p.nome,
                p.preco,
                p.estoque,
                c.nome AS categoria
            FROM produtos p
            INNER JOIN categorias c ON p.categoria_id = c.id
            ORDER BY p.nome
        `);

        res.json(resultado.rows);

    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    } finally {
        await client.end();
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});