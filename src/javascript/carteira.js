const wallet = document.getElementById("carteira"); //inicializa a carteira
let dinheiro = parseFloat(localStorage.getItem('dinheiro')) || 0; //inicializa o valor no local storage com 0

function atualizarCarteira(){
    wallet.innerText = dinheiro.toFixed(2); // 2 casas decimais
    localStorage.setItem('dinheiro', dinheiro); //uso do local storage pra manter o valor em todas as paginas
}

function addDinheiro(){ //função pra adicionar dinheiro
    const input = document.getElementById("dinheiroDigitado"); // pega o valor digitado
    const valor = parseFloat(input.value);  //converte a string digitada para float

    if(valor >= 0.1){
        dinheiro += valor; 
        atualizarCarteira(); 
    }else{
        alert("Por favor, insira um valor válido."); 
    }

    input.value = ''; //limpa o valor digitado no <input>

}

function sacarDinheiro(){
    const input = document.getElementById("dinheiroSaque"); // pega o valor digitado para saque
    const valor = parseFloat(input.value);  // converte a string digitada para float

    // verifica se o valor é um numero valido 
    if(valor <= 0 || valor > 30){ 
        alert("Por favor, insira um valor entre R$0.00 e R$30.00.");
        return;
    }

    const saldoMaximo = dinheiro; // saldo maximo disponivel para saque

    // se o usuario digitar mais do que o saldo disponível
    if(valor > saldoMaximo){
        alert("Saldo insuficiente para o saque.");
    }else{
        dinheiro -= valor; // subtrai o valor do saldo
        atualizarCarteira(); // atualiza a carteira na tela e no armazenamento
    }

    // limpa o numero digitado anteriormente
    input.value = '';
}

atualizarCarteira();