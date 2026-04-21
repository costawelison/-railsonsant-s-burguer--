let cart = {};
let total = 0;
let entrega = 0;

// ADICIONAR / REMOVER
function alterarQtd(nome, preco, change, selectId) {

    let nomeFinal = nome;

    if (selectId) {
        let sabor = document.getElementById(selectId).value;
        nomeFinal = nome + " - " + sabor;
    }

    if (!cart[nomeFinal]) {
        cart[nomeFinal] = {qtd: 0, preco: preco };
    }

    cart[nomeFinal].qtd += change;

    if (cart[nomeFinal].qtd <= 0) {
        delete cart[nomeFinal];
    }

    // Atualiza a tela com o nome base, para que todos os sabores sejam atualizados
    atualizarTela(nome); 
    atualizarCarrinho();
}

// ATUALIZA QUANTIDADE NA TELA
function atualizarTela(nomeBase) {
    let totalQtd = 0;

    for (let item in cart) {
        // Verifica se o item no carrinho começa com o nomeBase
        // Isso garante que estamos somando todos os sabores de uma mesma base
        if (item.startsWith(nomeBase)) { 
            totalQtd += cart[item].qtd;
        }
    }

    // Atualiza o elemento HTML que mostra a quantidade total para essa base de item
    let el = document.getElementById("qtd-" + nomeBase);
    if (el) {
        el.textContent = totalQtd;
    }
}

// ATUALIZA CARRINHO
function atualizarCarrinho() {

    let lista = document.getElementById("cart-list");
    lista.innerHTML = "";
    total = 0;

    for (let item in cart) {
        let dados = cart[item];
        let subtotal = dados.qtd * dados.preco;
        total += subtotal;

        let li = document.createElement("li");
        li.textContent = `${item} x${dados.qtd} - R$ ${subtotal.toFixed(2)}`;
        lista.appendChild(li);
    }

    document.getElementById("total").textContent =
        "Total: R$ " + (total + entrega).toFixed(2);
}
function verificarPagamento() {
    let pagamento = document.getElementById("pagamento").value;
    let troco = document.getElementById("areaTroco");

    if (pagamento === "Dinheiro") {
        troco.style.display = "block";
    } else {
        troco.style.display = "none";
    }
}
function verificarLoja() {
    const hoje = new Date().getDay(); // 0=domingo, 1=segunda...
    const status = document.getElementById("statusLoja");

    // Dias abertos: segunda(1), terça(2), quinta(4), sábado(6)
    if (hoje === 1 || hoje === 2 || hoje === 4 || hoje === 6) {
        status.innerHTML = "🟢 Aberto hoje - 19h às 23h";
        status.style.color = "lightgreen";
    } else {
        status.innerHTML = "🔴 Fechado hoje";
        status.style.color = "red";
    }
}

verificarLoja();

// ENVIAR PRO WHATSAPP
function enviarWhats() {
    let nome = document.getElementById("nome").value;
    let endereco = document.getElementById("endereco").value;
    let obs = document.getElementById("obs").value;
    let pagamento = document.getElementById("pagamento").value;
    let troco = document.getElementById("troco").value;

    let pedido = "🍔 *SANTOS BURGUER*\n\n";

    pedido += "👤 Nome: " + nome + "\n";
    pedido += "📍 Endereço: " + endereco + "\n\n";

    pedido += "🛒 Pedido:\n";

    for (let item in cart) {
    if (cart[item].qtd > 0) {
        pedido += `- ${cart[item].qtd}x ${item}\n`;
    }
}

    pedido += "\n💰 Total: R$ " + total.toFixed(2) + "\n";
    pedido += "💳 Pagamento: " + pagamento + "\n";

    if (pagamento === "Dinheiro" && troco) {
        pedido += "💵 Troco para: R$ " + troco + "\n";
    }

    if (obs) {
        pedido += "\n📝 Obs: " + obs + "\n";
    }

    // ⚠️ COLOCA SEU NÚMERO AQUI
    let numero = "5593991681029";

    let url = `https://wa.me/${numero}?text=${encodeURIComponent(pedido)}`;

    window.open(url, "_blank");
}
