// Classe para gerenciar endereços e busca de CEP
class GerenciadorEndereco {
    constructor() {
        this.campoRua = null;
        this.campoBairro = null;
        this.campoCidade = null;
        this.campoEstado = null;
        this.campoCep = null;
        this.campoNumero = null;
    }

    // Inicializa as referências dos elementos HTML
    inicializar() {
        this.campoCep = document.getElementById('cep');
        this.campoRua = document.getElementById('street');
        this.campoBairro = document.getElementById('neighborhood');
        this.campoCidade = document.getElementById('city');
        this.campoEstado = document.getElementById('state');
        this.campoNumero = document.getElementById('number');
        
        this.configurarEventListeners();
    }

    // Configura os event listeners para busca automática de CEP
    configurarEventListeners() {
        if (this.campoCep) {
            // Evento acionado quando o campo CEP perde o foco
            this.campoCep.addEventListener('blur', () => {
                this.processarCep();
            });
        }
    }

    // Processa o CEP digitado pelo usuário
    processarCep() {
        const cep = this.campoCep.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cep.length === 8) {
            this.buscarEndereco(cep);
        }
    }

    // Busca endereço completo através da API do ViaCEP
    async buscarEndereco(cep) {
        this.mostrarEstadoCarregamento();

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await response.json();

            if (dados.erro) {
                this.tratarErroEndereco('CEP não encontrado. Por favor, verifique e tente novamente.');
            } else {
                this.preencherCamposEndereco(dados);
            }
        } catch (erro) {
            this.tratarErroEndereco('Não foi possível buscar o CEP. Tente novamente.');
        }
    }

    // Mostra indicador visual de carregamento nos campos
    mostrarEstadoCarregamento() {
        this.campoRua.value = "...";
        this.campoBairro.value = "...";
        this.campoCidade.value = "...";
        this.campoEstado.value = "...";
    }

    // Preenche os campos de endereço com dados da API
    preencherCamposEndereco(dadosEndereco) {
        this.campoRua.value = dadosEndereco.logradouro || '';
        this.campoBairro.value = dadosEndereco.bairro || '';
        this.campoCidade.value = dadosEndereco.localidade || '';
        this.campoEstado.value = dadosEndereco.uf || '';
        
        // Move o foco para o próximo campo (número)
        if (this.campoNumero) {
            this.campoNumero.focus();
        }
    }

    // Limpa todos os campos de endereço
    limparCamposEndereco() {
        this.campoRua.value = "";
        this.campoBairro.value = "";
        this.campoCidade.value = "";
        this.campoEstado.value = "";
    }

    // Trata erros na busca de endereço
    tratarErroEndereco(mensagem) {
        alert(mensagem);
        this.limparCamposEndereco();
    }

    // Retorna o endereço completo como objeto
    obterEndereco() {
        return {
            cep: this.campoCep.value,
            rua: this.campoRua.value,
            numero: this.campoNumero.value,
            bairro: this.campoBairro.value,
            cidade: this.campoCidade.value,
            estado: this.campoEstado.value
        };
    }

    // Valida se todos os campos obrigatórios estão preenchidos
    enderecoEhValido() {
        const endereco = this.obterEndereco();
        return endereco.cep && endereco.rua && endereco.numero && 
               endereco.bairro && endereco.cidade && endereco.estado;
    }
}

// Classe para gerenciar o carrinho na página de checkout
class CarrinhoCheckout {
    constructor() {
        this.itens = [];
        this.elementoItensResumo = null;
        this.elementoTotalResumo = null;
    }

    // Inicializa o carrinho na página de checkout
    inicializar() {
        this.elementoItensResumo = document.getElementById('summary-items');
        this.elementoTotalResumo = document.getElementById('summary-total');
        this.carregarDoArmazenamento();
        this.renderizarResumo();
    }

    // Carrega dados do carrinho salvos no localStorage
    carregarDoArmazenamento() {
        const dadosCarrinho = JSON.parse(localStorage.getItem('techStoreCart')) || [];
        this.itens = dadosCarrinho;
    }

    // Calcula o valor total de todos os itens
    obterTotal() {
        return this.itens.reduce((total, item) => {
            return total + (item.preco * item.quantidade);
        }, 0);
    }

    // Verifica se o carrinho está vazio
    estaVazio() {
        return this.itens.length === 0;
    }

    // Renderiza o resumo visual do carrinho
    renderizarResumo() {
        if (this.estaVazio()) {
            this.elementoItensResumo.innerHTML = '<li>Seu carrinho está vazio.</li>';
            this.elementoTotalResumo.textContent = 'R$ 0,00';
            return;
        }

        // Limpa o container antes de adicionar novos itens
        this.elementoItensResumo.innerHTML = '';
        
        // Adiciona cada item do carrinho à lista visual
        this.itens.forEach(item => {
            const totalItem = item.preco * item.quantidade;
            const elementoLista = document.createElement('li');
            elementoLista.innerHTML = `
                <span>${item.nome} (x${item.quantidade})</span>
                <span>R$ ${totalItem.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
            `;
            this.elementoItensResumo.appendChild(elementoLista);
        });

        // Atualiza o total geral
        const total = this.obterTotal();
        this.elementoTotalResumo.textContent = `R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }

    // Remove o carrinho do armazenamento local
    limpar() {
        localStorage.removeItem('techStoreCart');
        this.itens = [];
    }

    // Obtém resumo completo do pedido para processamento
    obterResumoPedido() {
        return {
            itens: this.itens,
            total: this.obterTotal(),
            quantidadeItens: this.itens.reduce((contador, item) => contador + item.quantidade, 0)
        };
    }
}

// Classe para gerenciar validação e envio do formulário
class FormularioCheckout {
    constructor() {
        this.elementoFormulario = null;
        this.dadosCliente = {};
    }

    // Inicializa o formulário de checkout
    inicializar() {
        this.elementoFormulario = document.getElementById('checkout-form');
        this.configurarEventListeners();
    }

    // Configura eventos do formulário
    configurarEventListeners() {
        if (this.elementoFormulario) {
            this.elementoFormulario.addEventListener('submit', (evento) => {
                this.processarEnvio(evento);
            });
        }
    }

    // Processa o envio do formulário
    processarEnvio(evento) {
        evento.preventDefault();
        
        if (this.validarFormulario()) {
            this.coletarDadosCliente();
            this.processarPedido();
        }
    }

    // Valida se todos os campos obrigatórios estão preenchidos
    validarFormulario() {
        const camposObrigatorios = [
            'name', 'email', 'phone', 'cep', 'street', 
            'number', 'neighborhood', 'city', 'state'
        ];

        for (const idCampo of camposObrigatorios) {
            const campo = document.getElementById(idCampo);
            if (!campo || !campo.value.trim()) {
                alert(`Por favor, preencha o campo ${this.obterRotuloCampo(idCampo)}.`);
                if (campo) campo.focus();
                return false;
            }
        }

        return true;
    }

    // Retorna o nome amigável do campo para mensagens de erro
    obterRotuloCampo(idCampo) {
        const rotulos = {
            'name': 'Nome',
            'email': 'E-mail',
            'phone': 'Telefone',
            'cep': 'CEP',
            'street': 'Rua',
            'number': 'Número',
            'neighborhood': 'Bairro',
            'city': 'Cidade',
            'state': 'Estado'
        };
        return rotulos[idCampo] || idCampo;
    }

    // Coleta todos os dados preenchidos pelo cliente
    coletarDadosCliente() {
        this.dadosCliente = {
            nome: document.getElementById('name').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('phone').value,
            endereco: {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('street').value,
                numero: document.getElementById('number').value,
                complemento: document.getElementById('complement').value,
                bairro: document.getElementById('neighborhood').value,
                cidade: document.getElementById('city').value,
                estado: document.getElementById('state').value
            }
        };
    }

    // Processa o pedido finalizado
    processarPedido() {
        const nomeCliente = this.dadosCliente.nome;
        alert(`Obrigado, ${nomeCliente}! Seu pedido foi finalizado com sucesso.`);
        
        // Limpa o carrinho e redireciona para a página inicial
        gerenciadorCheckout.carrinho.limpar();
        window.location.href = 'index.html';
    }

    // Retorna os dados coletados do cliente
    obterDadosCliente() {
        return this.dadosCliente;
    }
}

// Classe principal que coordena todo o processo de checkout
class GerenciadorCheckout {
    constructor() {
        this.gerenciadorEndereco = new GerenciadorEndereco();
        this.carrinho = new CarrinhoCheckout();
        this.formulario = new FormularioCheckout();
    }

    // Inicializa todo o sistema de checkout
    inicializar() {
        this.gerenciadorEndereco.inicializar();
        this.carrinho.inicializar();
        this.formulario.inicializar();
        
        // Verifica se há itens no carrinho
        if (this.carrinho.estaVazio()) {
            this.tratarCarrinhoVazio();
        }
    }

    // Trata o caso de carrinho vazio redirecionando para a loja
    tratarCarrinhoVazio() {
        alert('Seu carrinho está vazio. Redirecionando para a loja...');
        window.location.href = 'index.html';
    }

    // Obtém todos os dados consolidados do checkout
    obterDadosCheckout() {
        return {
            cliente: this.formulario.obterDadosCliente(),
            endereco: this.gerenciadorEndereco.obterEndereco(),
            pedido: this.carrinho.obterResumoPedido()
        };
    }

    // Valida se todos os dados necessários estão corretos
    checkoutEhValido() {
        return this.formulario.validarFormulario() && 
               this.gerenciadorEndereco.enderecoEhValido() && 
               !this.carrinho.estaVazio();
    }
}

// Instância global do gerenciador de checkout
const gerenciadorCheckout = new GerenciadorCheckout();

// Inicialização automática quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    gerenciadorCheckout.inicializar();
});