let cart = [];
let tempProd = {};
let selectedSize = "";
let selectedColor = "Única";
const SEU_NUMERO = "5527996710061";                                                                                                                                                                                                                                         

function toggleTheme() {
    const html = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const icon = themeBtn.querySelector('i');
    
    if (html.getAttribute('data-bs-theme') === 'light') {
        html.setAttribute('data-bs-theme', 'dark');
        icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-bs-theme', 'light');
        icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        localStorage.setItem('theme', 'light');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.getElementById('themeBtn').querySelector('i').classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
    }
});

function verProduto(nome, preco, img, temCores = false, imgBranca = '') {
    tempProd = { nome, preco, imgPadrao: img, imgBranca: imgBranca, temCores: temCores };
    selectedSize = "";
    selectedColor = temCores ? "Preta" : "Única";
    
    document.getElementById('p-nome').innerText = nome;
    document.getElementById('p-preco').innerText = "R$ " + preco;
    document.getElementById('p-img').src = img;

    const contCores = document.getElementById('container-cores');
    if(temCores) {
        contCores.style.display = 'block';
        document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
        document.getElementById('cor-preta').classList.add('active');
    } else {
        contCores.style.display = 'none';
    }

    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    new bootstrap.Modal(document.getElementById('modalProduto')).show();
}

function selecionarCor(nomeCor, corHex, el) {
    selectedColor = nomeCor;
    document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('p-img').src = (nomeCor === 'Branca') ? tempProd.imgBranca : tempProd.imgPadrao;
}

function selecionarTamanho(el) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    selectedSize = el.innerText;
}

function adicionar() {
    if(!selectedSize) return alert("Escolha um tamanho!");
    const imagemFinal = (selectedColor === 'Branca') ? tempProd.imgBranca : tempProd.imgPadrao;
    cart.push({
        nome: tempProd.nome, 
        preco: tempProd.preco, 
        tamanho: selectedSize, 
        cor: selectedColor,
        img: imagemFinal
    });
    renderCart();
    bootstrap.Modal.getInstance(document.getElementById('modalProduto')).hide();
}

function renderCart() {
    const container = document.getElementById('corpoCarrinho');
    document.getElementById('cart-count').innerText = cart.length;
    if(cart.length === 0) {
        container.innerHTML = '<p class="text-center py-4">Carrinho vazio</p>';
        document.getElementById('totalTxt').innerText = "R$ 0,00";
        return;
    }
    container.innerHTML = cart.map((item, i) => `
        <div class="d-flex align-items-center mb-3">
            <img src="${item.img}" width="60" class="me-3">
            <div class="flex-grow-1">
                <h6 class="mb-0 small">${item.nome}</h6>
                <small>Cor: ${item.cor} | Tam: ${item.tamanho} | R$ ${item.preco}</small>
            </div>
            <i class="bi bi-trash text-danger" style="cursor:pointer" onclick="remover(${i})"></i>
        </div>
    `).join('');
    let total = cart.reduce((acc, item) => acc + parseFloat(item.preco), 0);
    document.getElementById('totalTxt').innerText = `R$ ${total.toFixed(2)}`;
}

function remover(i) {
    cart.splice(i, 1);
    renderCart();
}

function finalizarPedido() {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    let mensagem = "Olá Wit Conceito! Gostaria de fazer um pedido:\n\n";
    let total = 0;
    cart.forEach(item => {
        mensagem += `• ${item.nome} (${item.cor} - ${item.tamanho}) - R$ ${item.preco}\n`;
        total += parseFloat(item.preco);
    });
    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;
    window.open(`https://wa.me/${SEU_NUMERO}?text=${encodeURIComponent(mensagem)}`, '_blank');
}