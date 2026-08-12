const form = document.getElementById('form-filme');
const genero = document.getElementById('genero');
const mensagem = document.getElementById('mensagem');

async function carregarGeneros() {
    try {
        const resposta = await fetch('/api/generos');

        if (!resposta.ok) {
            throw new Error('Erro ao carregar gêneros');
        }

        const generos = await resposta.json();

        generos.forEach(item => {
            const option = document.createElement('option');

            option.value = item.id;
            option.textContent = item.nome;

            genero.appendChild(option);
        });

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = {
        titulo: document.getElementById('titulo').value,
        diretor: document.getElementById('diretor').value,
        ano: document.getElementById('ano').value || null,
        nota: document.getElementById('nota').value || null,
        duracao: document.getElementById('duracao').value || null,
        genero_id: genero.value
    };

    try {
        const resposta = await fetch('/api/filmes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.status === 400) {
            mensagem.textContent = resultado.erro;
            return;
        }

        if (resposta.status === 500) {
            mensagem.textContent = 'Erro interno do servidor';
            return;
        }

        mensagem.textContent =
            `Filme "${resultado.titulo}" cadastrado com sucesso!`;

        form.reset();

    } catch (erro) {
        mensagem.textContent = 'Erro ao conectar com a API';
    }
});

carregarGeneros();