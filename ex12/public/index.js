let filmes = [];

const tabela = document.getElementById('tabela-filmes');
const busca = document.getElementById('busca');
const genero = document.getElementById('genero');
const mensagem = document.getElementById('mensagem');

function mostrarFilmes(lista) {
    tabela.innerHTML = '';

    lista.forEach(filme => {
        const linha = document.createElement('tr');

        let cor;

        if (filme.nota >= 9) {
            cor = 'green';
        } else if (filme.nota >= 7) {
            cor = 'orange';
        } else {
            cor = 'red';
        }

        linha.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.diretor}</td>
            <td>${filme.genero}</td>
            <td>${filme.ano}</td>
            <td style="color: ${cor}">${filme.nota}</td>
            <td>
                <button onclick="editarNota(${filme.id}, this)">
                    Editar Nota
                </button>

                <button onclick="removerFilme(${filme.id}, this)">
                    Remover
                </button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

async function carregarFilmes(url = '/api/filmes') {
    try {
        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error('Erro ao carregar filmes');
        }

        filmes = await resposta.json();

        mostrarFilmes(filmes);

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

async function carregarGeneros() {
    try {
        const resposta = await fetch('/api/generos');

        if (!resposta.ok) {
            throw new Error('Erro ao carregar gêneros');
        }

        const generos = await resposta.json();

        generos.forEach(item => {
            const option = document.createElement('option');

            option.value = item.nome;
            option.textContent = item.nome;

            genero.appendChild(option);
        });

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

async function removerFilme(id, botao) {
    if (!confirm('Tem certeza que deseja remover este filme?')) {
        return;
    }

    try {
        const resposta = await fetch(`/api/filmes/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || 'Erro ao remover filme');
        }

        botao.closest('tr').remove();

        mensagem.textContent =
            `Filme "${resultado.titulo}" removido com sucesso!`;

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

function editarNota(id, botao) {
    const linha = botao.closest('tr');
    const celulaNota = linha.children[4];
    const notaAtual = filmes.find(filme => filme.id === id).nota;

    const input = document.createElement('input');

    input.type = 'number';
    input.min = '0';
    input.max = '10';
    input.step = '0.1';
    input.value = notaAtual;

    celulaNota.innerHTML = '';
    celulaNota.appendChild(input);

    input.focus();

    async function salvarNota() {
        const novaNota = Number(input.value);

        if (novaNota < 0 || novaNota > 10 || input.value === '') {
            mensagem.textContent = 'A nota deve estar entre 0 e 10';
            input.focus();
            return;
        }

        try {
            const resposta = await fetch(`/api/filmes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nota: novaNota
                })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || 'Erro ao atualizar nota');
            }

            celulaNota.textContent = resultado.nota;

            filmes.find(filme => filme.id === id).nota = resultado.nota;

            mensagem.textContent = 'Nota atualizada com sucesso!';

        } catch (erro) {
            mensagem.textContent = erro.message;
            celulaNota.textContent = notaAtual;
        }
    }

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            salvarNota();
        }
    });

    input.addEventListener('blur', salvarNota);
}

busca.addEventListener('input', () => {
    const texto = busca.value.toLowerCase();

    const filtrados = filmes.filter(filme =>
        filme.titulo.toLowerCase().includes(texto)
    );

    mostrarFilmes(filtrados);
});

genero.addEventListener('change', () => {
    if (genero.value === '') {
        carregarFilmes();
    } else {
        carregarFilmes(
            `/api/filmes?genero=${encodeURIComponent(genero.value)}`
        );
    }
});

carregarFilmes();
carregarGeneros();