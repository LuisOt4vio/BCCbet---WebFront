
function atualizarCarteira() {
    document.getElementById('carteira').innerText = dinheiro.toFixed(2);
    localStorage.setItem('dinheiro', dinheiro.toFixed(2)); // Armazena o valor atualizado no localStorage
}

document.addEventListener('DOMContentLoaded', () => {
    const valorApostaInput = document.getElementById('valorAposta');
    const resultado = document.getElementById('resultado');
    const guessBtn = document.getElementById('guessBtn');
    let selecionar = null;

    atualizarCarteira(); // Atualiza a carteira na carga da página

    // Função para selecionar o naipe
    document.querySelectorAll('#escolhas .choice').forEach(element => {
        element.addEventListener('click', () => {
            document.querySelectorAll('#escolhas .choice').forEach(element => element.classList.remove('selected'));
            element.classList.add('selected');
            selecionar = element.getAttribute('data-value');
        });
    });

    
   
    const card = document.getElementById('carta');
    const cardFrontImage = document.getElementById('cartaFrontImage');
    let animacao = false; // Variável para controlar o estado da animação
   // Função para adivinhar
    guessBtn.addEventListener('click', () => {
        if (animacao) return; // Se estiver animando, não faça nada
    
        const valorAposta = parseFloat(valorApostaInput.value); // valor inserido
    
        if (!selecionar) {
            document.getElementById('result').textContent = 'Por favor, selecione um naipe!';
            return;
        }
    
        if (isNaN(valorAposta) || valorAposta <= 0) {
            document.getElementById('result').textContent = 'Por favor, insira um valor de aposta válido!';
            return;
        }
    
        if (valorAposta > dinheiro) {
            document.getElementById('result').textContent = 'Você não pode apostar mais do que o saldo disponível!';
            return;
        }
    
        const suits = ['Copas', 'Espadas', 'Ouros', 'Paus'];
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const EscolhaCerta = selecionar === randomSuit;
    
        let resultMessage = '';
    
        if (EscolhaCerta) {
            resultMessage = 'Parabéns! Você acertou a carta!';
            dinheiro += valorAposta; 
            resultado.innerText = `Você ganhou R$${valorAposta.toFixed(2)}!`;
        } else {
            resultMessage = 'Errou! Tente novamente.';
            dinheiro -= valorAposta;
            resultado.innerText = `Você perdeu R$${valorAposta.toFixed(2)}!`;
        }
    
        atualizarCarteira(); // Atualiza a carteira após alterar o valor
        
        document.getElementById('result').textContent = `O naipe da carta era ${randomSuit}. ${resultMessage}`;
    
        // Marca a animação como em andamento e desabilita o botão
        animacao = true;
        guessBtn.style.opacity = '0'; // Torna o botão invisível
        
        // Muda a imagem da carta e adiciona a classe de animação
        cardFrontImage.src = `../../imagens/Images/${randomSuit}.png`;
        card.classList.add('flip');
    
        // Remove a classe de animação e reabilita o botão após a primeira transição
        card.addEventListener('transitionend', function removeAnimacao() {
            card.classList.remove('flip');
            
           
            card.removeEventListener('transitionend', removeAnimacao);
    
            
            setTimeout(() => {
                cardFrontImage.src = `../../imagens/Images/interrogacao.png`;
                card.classList.add('flip');
    
                card.addEventListener('transitionend', function removeAnimacaoNovamente() {
                    card.classList.remove('flip');
                    animacao = false;
                    setTimeout(() =>{ guessBtn.style.opacity = '1';},2000);
                    
                   
                    
                },{once:true}); 
            }, 8000);  
        },{once:true});
    });
    
});
