let lista = JSON.parse(localStorage.getItem("lista")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];

function atualizarLista() {
  const listaEl = document.getElementById("lista");
  const totalEl = document.getElementById("total");
  listaEl.innerHTML = "";
  let total = 0;

  lista.forEach((item, index) => {
    const li = document.createElement("li");
    const valorTotal = item.valor * item.quantidade;
    total += valorTotal;

    li.innerHTML = `
      ${item.produto} - ${item.quantidade}x R$${item.valor.toFixed(2)} (${
      item.categoria
    })
      <span>
        <button class="edit" onclick="editarItem(${index})">Editar</button>
        <button class="remove" onclick="removerItem(${index})">Remover</button>
      </span>
    `;
    listaEl.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
  atualizarGrafico();
}

function adicionarItem() {
  const produto = document.getElementById("produto").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;

  if (!produto || !quantidade || !valor || !categoria)
    return alert("Preencha todos os campos!");

  lista.push({ produto, quantidade, valor, categoria });
  localStorage.setItem("lista", JSON.stringify(lista));
  limparCampos();
  atualizarLista();
}

function filtrarLista() {
  const busca = document.getElementById("busca").value.toLowerCase();
  const listaEl = document.getElementById("lista");
  listaEl.innerHTML = "";
  lista.forEach((item, index) => {
    if (item.produto.toLowerCase().includes(busca)) {
      const li = document.createElement("li");
      const valorTotal = item.valor * item.quantidade;
      li.innerHTML = `        ${item.produto} - ${
        item.quantidade
      }x R$${item.valor.toFixed(2)} (${item.categoria})

        <span>
        <button class="edit" onclick="editarItem(${index})">Editar</button>
        <button class="remove" onclick="removerItem(${index})">Remover</button>
        </span>
        `;
      listaEl.appendChild(li);
    }
  });
}

function limparCampos() {
  document.getElementById("produto").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";
}

function editarItem(index) {
  const item = lista[index];
  document.getElementById("produto").value = item.produto;
  document.getElementById("quantidade").value = item.quantidade;
  document.getElementById("valor").value = item.valor;
  document.getElementById("categoria").value = item.categoria;
  lista.splice(index, 1);
  atualizarLista();
}

function removerItem(index) {
  lista.splice(index, 1);
  localStorage.setItem("lista", JSON.stringify(lista));
  atualizarLista();
}

function limparLista() {
  lista = [];
  localStorage.setItem("lista", JSON.stringify(lista));
  atualizarLista();
}

function finalizarCompra() {
  const data = new Date().toLocaleDateString();
  const total = lista.reduce(
    (acc, item) => acc + item.valor * item.quantidade,
    0
  );

  if (lista.length > 0) {
    historico.push({ data, total, itens: [...lista] });
    localStorage.setItem("historico", JSON.stringify(historico));
    limparLista();
    alert("Compra finalizada!");
  }
}

function mostrarGastosMensais() {
  document.querySelector(".container").style.display = "none";
  document.querySelector(".mensal-container").style.display = "block";

  const ul = document.getElementById("gastosMensais");
  ul.innerHTML = "";

  historico.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.data}</strong> - Total: R$ ${item.total.toFixed(2)}
      <button class="detalhes" onclick="mostrarDetalhes(${index})">Ver Detalhes</button>
    `;
    ul.appendChild(li);
  });
}

function mostrarDetalhes(index) {
  const item = historico[index];
  const detalhesDiv = document.createElement("div");
  detalhesDiv.classList.add("relatorio");

  let html = `<h3>Relatório de ${item.data}</h3><ul>`;
  item.itens.forEach((produto) => {
    const valorTotal = produto.valor * produto.quantidade;
    html += `
      <li>
        ${produto.produto} - ${produto.quantidade}x R$${produto.valor.toFixed(
      2
    )} = 
        <strong>R$${valorTotal.toFixed(2)}</strong> (${produto.categoria})
      </li>`;
  });
  html += `</ul><p><strong>Total:</strong> R$${item.total.toFixed(2)}</p>`;

  detalhesDiv.innerHTML = html;

  const container = document.querySelector(".mensal-container");
  container.appendChild(detalhesDiv);
}

function voltar() {
  document.querySelector(".container").style.display = "block";
  document.querySelector(".mensal-container").style.display = "none";
}

let grafico;

function atualizarGrafico() {
  const ctx = document.getElementById("graficoPizza").getContext("2d");

  const categorias = {};
  lista.forEach((item) => {
    const valor = item.valor * item.quantidade;
    categorias[item.categoria] = (categorias[item.categoria] || 0) + valor;
  });

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gastos por Categoria",
          data: data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8BC34A",
            "#FF9800",
            "#9C27B0",
          ],
        },
      ],
    },
  });
}

function renderizarGraficoDetalhado(categorias) {
  const ctx = document.getElementById("graficoDetalhado").getContext("2d");

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8BC34A",
            "#FF9800",
            "#9C27B0",
          ],
        },
      ],
    },
  });
}

// Adicionar no final do script.js

// Efeito de carregamento suave
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.opacity = "0";
  setTimeout(function () {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Animação ao adicionar itens
function animarAdicaoItem(index) {
  const listaEl = document.getElementById("lista");
  const items = listaEl.getElementsByTagName("li");
  if (items[index]) {
    items[index].style.transform = "scale(1.05)";
    items[index].style.backgroundColor = "#e3f2fd";
    setTimeout(() => {
      items[index].style.transform = "scale(1)";
      items[index].style.backgroundColor = "";
    }, 300);
  }
}

// Modificar a função adicionarItem para incluir a animação
function adicionarItem() {
  const produto = document.getElementById("produto").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;

  if (!produto || !quantidade || !valor || !categoria)
    return alert("Preencha todos os campos!");

  lista.push({ produto, quantidade, valor, categoria });
  localStorage.setItem("lista", JSON.stringify(lista));
  limparCampos();
  atualizarLista();
  // Animação no novo item
  setTimeout(() => animarAdicaoItem(lista.length - 1), 10);
}

// Animação ao remover itens
function animarRemocaoItem(element) {
  element.style.transform = "translateX(-100px)";
  element.style.opacity = "0";
  setTimeout(() => {
    element.remove();
  }, 300);
}

// Modificar a função removerItem para incluir a animação
function removerItem(index) {
  const listaEl = document.getElementById("lista");
  const items = listaEl.getElementsByTagName("li");
  if (items[index]) {
    animarRemocaoItem(items[index]);
  }

  setTimeout(() => {
    lista.splice(index, 1);
    localStorage.setItem("lista", JSON.stringify(lista));
    atualizarLista();
  }, 300);
}

// Controle do Tema Dark/White
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Verificar preferência do usuário ou tema salvo
const savedTheme = localStorage.getItem("theme") || "light";
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeToggle.textContent = "☀️ Modo Claro";
}

// Alternar tema
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️ Modo Claro";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙 Modo Escuro";
    localStorage.setItem("theme", "light");
  }

  // Atualizar gráficos quando o tema muda
  setTimeout(atualizarGrafico, 100);
});

// Modificar a função atualizarGrafico para respeitar o tema
function atualizarGrafico() {
  const ctx = document.getElementById("graficoPizza").getContext("2d");

  // Cores baseadas no tema
  const backgroundColors = body.classList.contains("dark-mode")
    ? [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
      ]
    : ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800", "#9C27B0"];

  const categorias = {};
  lista.forEach((item) => {
    const valor = item.valor * item.quantidade;
    categorias[item.categoria] = (categorias[item.categoria] || 0) + valor;
  });

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gastos por Categoria",
          data: data,
          backgroundColor: backgroundColors,
          borderColor: body.classList.contains("dark-mode") ? "#444" : "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: body.classList.contains("dark-mode") ? "#f0f0f0" : "#666",
          },
        },
      },
    },
  });
}

// Atualizar também a função renderizarGraficoDetalhado de forma similar
function renderizarGraficoDetalhado(categorias) {
  const ctx = document.getElementById("graficoDetalhado").getContext("2d");

  const backgroundColors = body.classList.contains("dark-mode")
    ? [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
      ]
    : ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800", "#9C27B0"];

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: body.classList.contains("dark-mode") ? "#444" : "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: body.classList.contains("dark-mode") ? "#f0f0f0" : "#666",
          },
        },
      },
    },
  });
}

atualizarLista();
