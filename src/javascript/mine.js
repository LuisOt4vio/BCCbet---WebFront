//Obtém os elementos HTML dos botões e campos de entrada
const botaoApostar = document.getElementById('BotaoAposta');
const botaoPararAposta = document.getElementById('BotaoStopAposta');
const entradaNumeroMinas = document.getElementById('QuantidadeMina');
const entradaAposta = document.getElementById('ValorApostado');

//Inicializa variáveis para o estado do jogo
let tabuleiroJogo = [], valorAposta=0, ganhos=0, jogoIniciado=false;
const tamanhoTabuleiro=5, celulasTotais=tamanhoTabuleiro*tamanhoTabuleiro;
const atualizar=(id, valor)=>document.getElementById(id).textContent=`R$ ${valor.toFixed(2)}`;  //Função para atualizar o valor exibido em um elemento com o ID fornecido
const saldo=()=>parseFloat(localStorage.getItem('dinheiro'))||0; //Função para obter o saldo armazenado no localStorage
const atualizarSaldo=()=>atualizar('balance', saldo()); //Atualiza o saldo exibido na tela

//Atualiza os ganhos exibidos na tela
const atualizarGanhos=()=>atualizar('winnings', ganhos);

//Função para revelar as minas no tabuleiro
const revelarMinasNaTela=()=>{
    const celulas=document.querySelectorAll('.cell'); //Seleciona todas as células do tabuleiro
    tabuleiroJogo.forEach((valor, i)=>{
        if (valor==='M'){ //Se a célula contém uma mina
            const celula=celulas[i];
            celula.classList.add('mine'); //Adiciona classes para estilizar a célula
            celula.textContent = '💣'; //Define o conteúdo da célula como uma bomba
        }
    });
};

//Adiciona um listener para o botão de apostar
botaoApostar.addEventListener('click',()=>{
    valorAposta=parseFloat(entradaAposta.value); //Obtém o valor da aposta
    let valorSaldo=saldo(); //Obtém o saldo atual
    const numeroMinas=parseInt(entradaNumeroMinas.value); //Obtém o número de minas
    //Verifica se a aposta é válida e se o saldo é suficiente
    if(valorAposta>0&&valorAposta<=valorSaldo){
        localStorage.setItem('dinheiro', (valorSaldo-valorAposta).toFixed(2)); //Atualiza o saldo
        ganhos=0; //Reseta os ganhos
        jogoIniciado=true; //Marca que o jogo foi iniciado
        atualizarSaldo(); //Atualiza o saldo exibido
        colocarMinas(numeroMinas); //Coloca as minas no tabuleiro
        renderizarTabuleiro(); //Renderiza o tabuleiro
        //revelarMinasNaTela();
        botaoApostar.disabled=true; //Desabilita o botão de apostar
        botaoPararAposta.disabled=false; //Habilita o botão de parar aposta
    }else{
        alert("Aposta inválida ou saldo insuficiente."); //Mostra alerta se a aposta for inválida
    }
});

//Adiciona um listener para o botão de parar aposta
botaoPararAposta.addEventListener('click',()=>{
    finalizarAposta(); //Finaliza a aposta
});

//Função para colocar minas aleatoriamente no tabuleiro
const colocarMinas=(numeroMinas)=>{
    tabuleiroJogo=Array(celulasTotais).fill(0); //Inicializa o tabuleiro com células vazias
    for (let i=0;i<numeroMinas; i++) {
        let idx;
        do {idx=Math.floor(Math.random()*celulasTotais);} //Escolhe uma célula aleatoriamente
        while(tabuleiroJogo[idx]==='M'); //Garante que a célula escolhida não tenha uma mina
        tabuleiroJogo[idx]='M'; //Coloca uma mina na célula
    }
};

//Função para renderizar o tabuleiro no HTML
const renderizarTabuleiro=()=>{
    const elementoTabuleiro=document.getElementById('game-board');
    elementoTabuleiro.innerHTML=''; //Limpa o conteúdo atual do tabuleiro
    tabuleiroJogo.forEach((_, i)=>{
        const celula=document.createElement('div'); //Cria um novo elemento para a célula
        celula.classList.add('cell'); //Adiciona a classe 'cell' para estilizar a célula
        celula.addEventListener('click',()=>clicarCelula(celula, i)); //Adiciona um listener para clique na célula
        elementoTabuleiro.appendChild(celula); //Adiciona a célula ao tabuleiro
    });
};

//Função para calcular os ganhos com base no número de minas
const calcularGanhos=(numeroMinas)=>{
    const dificuldade=(celulasTotais-numeroMinas)/celulasTotais; //Calcula a dificuldade com base no número de minas
    const multiplicador=0.25+(1/dificuldade); //Calcula o multiplicador com base na dificuldade
    return valorAposta*multiplicador; //Calcula os ganhos
};

//Função chamada quando uma célula é clicada
const clicarCelula=(celula, i)=>{
    if(!jogoIniciado||celula.classList.contains('safe')) return; //Não faz nada se o jogo não foi iniciado ou a célula já foi revelada

    if(tabuleiroJogo[i]==='M'){ //Se a célula contém uma mina
        celula.classList.add('mine'); //Adiciona classes para estilizar a célula
        celula.textContent = '💣'; //Define o conteúdo da célula como uma bomba
        setTimeout(()=>{
            alert('Você perdeu!'); //Mostra um alerta se o jogador perder
            finalizarAposta(true); //Finaliza a aposta e perde o valor apostado e os ganhos
        },100);
    }else{
        celula.classList.add('safe'); //Adiciona classes para estilizar a célula
        celula.textContent='✔️'; //Define o conteúdo da célula como seguro
        ganhos+=calcularGanhos(tabuleiroJogo.filter(v => v === 'M').length); //Atualiza os ganhos com base nas minas
        atualizarGanhos(); //Atualiza os ganhos exibidos
        //Verifica se todas as células seguras foram reveladas
        setTimeout(()=>{
            if(document.querySelectorAll('.safe').length===celulasTotais-tabuleiroJogo.filter(v => v === 'M').length){
            alert(`Você ganhou! Valor total ganho: R$ ${ganhos.toFixed(2)}`); //Mostra um alerta com o valor total ganho
            finalizarAposta(); //Finaliza a aposta e adiciona os ganhos ao saldo
        }}, 100);
    }
};

//Função para finalizar a aposta
const finalizarAposta=(perdeu=false)=>{
    const valorSaldo=saldo(); //Obtém o saldo atual
    if(perdeu){
        //Se perdeu, o saldo é reduzido pela aposta
        localStorage.setItem('dinheiro', valorSaldo.toFixed(2));
    } else{
        //Se ganhou, o saldo é aumentado pela aposta mais os ganhos
        localStorage.setItem('dinheiro', (valorSaldo + valorAposta + ganhos).toFixed(2));
    }
    ganhos=0; //Reseta os ganhos
    atualizarSaldo(); //Atualiza o saldo exibido
    atualizarGanhos(); //Atualiza os ganhos exibidos
    botaoApostar.disabled=false; //Habilita o botão de apostar
    botaoPararAposta.disabled=true; //Desabilita o botão de parar aposta
    jogoIniciado=false; //Marca que o jogo foi finalizado
    criarTabuleiro();//Cria um novo tabuleiro
};

//Função para criar um novo tabuleiro
const criarTabuleiro=()=>{
    tabuleiroJogo=Array(celulasTotais).fill(0); //Inicializa o tabuleiro com células vazias
    renderizarTabuleiro(); //Renderiza o novo tabuleiro
};

criarTabuleiro(); //Cria o tabuleiro inicial
atualizarSaldo(); //Atualiza o saldo exibido
atualizarGanhos(); //Atualiza os ganhos exibidos
