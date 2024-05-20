import { v4 } from "uuid";

const listagemProdutos = document.querySelector(".secao__principal-produtos-listagem");
const nome = document.querySelectorAll(".secao__principal-formulario input")[0];
const valor = document.querySelectorAll(".secao__principal-formulario input")[1];
const imagem = document.querySelectorAll(".secao__principal-formulario input")[2];
const btnGuardar = document.querySelectorAll(".secao__principal-formulario-botoes button")[0];

const produto = {
  id: "",
  nome: "",
  preco: "",
  imagem: ""
}

const guardarValores = (e) => {
  const nome = e.target.name;
  const valor = e.target.value;

  produto[nome] = valor;
}

nome.oninput = (e) => {
  guardarValores(e);
}

valor.oninput = (e) => {
  guardarValores(e);
}

imagem.oninput = (e) => {
  guardarValores(e);
}

const registrarProduto = (produto) => {
  produto.id = v4();

  produto.preco = Number(produto.preco);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  };

  return fetch("http://localhost:3000/produtos", options);
}

btnGuardar.onclick = async (e) => {
  e.preventDefault();

  await registrarProduto(produto);

  listagemProdutos.innerHTML = ``;
  await gerarCard();
}

const buscarProdutos = () => {
  return fetch("http://localhost:3000/produtos")
    .then(data => data.json());
}

const gerarCard = async () => {
  const produto = await buscarProdutos();

  produto.forEach(produto => {
    const div = document.createElement("div");
    const cardTemplate = `
  <div class="secao__principal-produtos-card">
  <div class="secao__principal-produtos-card-imagem">
    <img src="${produto.imagem}" alt="${produto.nome}">
  </div>
  <h4 class="secao__principal-produtos-card-nome">${produto.nome}</h4>
  <div class="secao__principal-produtos-card-preco">
    <span data-id="${produto.id}">R$ ${produto.preco}</span>
    <i class="fa-solid fa-trash"></i>
  </div>
</div>
  `;
    div.innerHTML = cardTemplate;
    listagemProdutos.appendChild(div);

    const btnApagar = document.querySelectorAll(".secao__principal-produtos-card-preco i");
    btnApagar.forEach((botao) => {
      botao.onclick = async () => {
        const id = botao.previousElementSibling.dataset.id;
        await apagarProduto(id);
        listagemProdutos.innerHTML = ``;
        await gerarCard();
      }
    });
  });
}

const apagarProduto = (id) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return fetch(`http://localhost:3000/produtos/${id}`, options);
};

gerarCard();