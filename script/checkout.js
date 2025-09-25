// js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const cepInput = document.getElementById('cep');
    const streetInput = document.getElementById('street');
    const neighborhoodInput = document.getElementById('neighborhood');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const checkoutForm = document.getElementById('checkout-form');
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');

    // Função para buscar e preencher o endereço
    const fetchAddress = async (cep) => {
        // Limpa os campos enquanto busca
        streetInput.value = "...";
        neighborhoodInput.value = "...";
        cityInput.value = "...";
        stateInput.value = "...";

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado. Por favor, verifique e tente novamente.');
                clearAddressFields();
            } else {
                streetInput.value = data.logradouro;
                neighborhoodInput.value = data.bairro;
                cityInput.value = data.localidade;
                stateInput.value = data.uf;
                document.getElementById('number').focus(); // Move o foco para o campo de número
            }
        } catch (error) {
            alert('Não foi possível buscar o CEP. Tente novamente.');
            clearAddressFields();
        }
    };

    // Função para limpar os campos de endereço
    const clearAddressFields = () => {
        streetInput.value = "";
        neighborhoodInput.value = "";
        cityInput.value = "";
        stateInput.value = "";
    };

    // Adiciona o evento ao campo CEP
    cepInput.addEventListener('blur', () => { // 'blur' é acionado quando o campo perde o foco
        const cep = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cep.length === 8) {
            fetchAddress(cep);
        }
    });

    // Carrega e exibe o resumo do carrinho
    const loadCartSummary = () => {
        const cart = JSON.parse(localStorage.getItem('techStoreCart')) || [];

        if (cart.length === 0) {
            summaryItems.innerHTML = '<li>Seu carrinho está vazio.</li>';
            return;
        }

        let total = 0;
        summaryItems.innerHTML = ''; // Limpa antes de adicionar
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>R$ ${itemTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>`;
            summaryItems.appendChild(li);
        });

        summaryTotal.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    };

    // Lida com o envio final do formulário
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        alert(`Obrigado, ${name}! Seu pedido foi finalizado com sucesso.`);

        // Limpa o carrinho e redireciona para a página inicial
        localStorage.removeItem('techStoreCart');
        window.location.href = 'index.html';
    });
    
    // Inicia o carregamento do resumo
    loadCartSummary();
});