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

app.get('/api/generos', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT id, nome FROM public.generos ORDER BY nome'
        );

        res.json(resultado.rows);
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });
    }
});

app.post('/api/filmes', async (req, res) => {
    const {
        titulo,
        diretor,
        ano,
        nota,
        duracao,
        genero_id
    } = req.body;

    if (
        !titulo ||
        !diretor ||
        !ano ||
        nota === undefined ||
        !duracao ||
        !genero_id
    ) {
        return res.status(400).json({
            erro: 'Todos os campos são obrigatórios'
        });
    }

    const anoNumero = Number(ano);
    const notaNumero = Number(nota);
    const duracaoNumero = Number(duracao);
    const generoNumero = Number(genero_id);

    if (notaNumero < 0 || notaNumero > 10) {
        return res.status(400).json({
            erro: 'A nota deve estar entre 0 e 10'
        });
    }

    try {
        const resultado = await pool.query(
            `
            INSERT INTO public.filmes
            (titulo, diretor, ano, nota, duracao, genero_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, titulo
            `,
            [
                titulo,
                diretor,
                anoNumero,
                notaNumero,
                duracaoNumero,
                generoNumero
            ]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            erro: erro.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
