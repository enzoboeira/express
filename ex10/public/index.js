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
            cor = 'yellow';
        } else {
            cor = 'red';
        }

        linha.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.diretor}</td>
            <td>${filme.genero}</td>
            <td>${filme.ano}</td>
            <td style="color: ${cor}">${filme.nota}</td>
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
        mensagem.textContent = '';
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
