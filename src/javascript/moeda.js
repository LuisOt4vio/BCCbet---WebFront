const botaoCara = document.getElementById('botaoCara');
const botaoCoroa = document.getElementById('botaoCoroa');
const valorApostaInput = document.getElementById('valorAposta'); //valor inserido
const resultado = document.getElementById('resultado');

const gifInicio = document.getElementById('gifInicio'); //gif de inicio
const gifMoeda = document.getElementById('gifMoeda'); //gif ao apostar

function obtemLadoMoeda(){ //funcao para pegar um lado da moeda
    const numeroRandom = Math.random(); //funcao de pegar um numero aleatorio

    if(numeroRandom > 0.5){ //o random vai de 0 a 1
      return 'cara';
    }else{
      return 'coroa';
    }
}

function reiniciarGif(gifMoeda, src){ //funcao que retira o diretorio do arquivo e o coloca novamente para reiniciar o gif
  gifMoeda.src = ''; 
  gifMoeda.src = src; 
}

botaoCara.addEventListener('click', function (){ // funcao que executa ao clicar em um botao
  gifInicio.style.display = 'none'; //retira o gif de intro
  reiniciarGif(gifMoeda, gifMoeda.src);  //se certifica que vai repetir o gif para as proximas apostas
  gifMoeda.style.display = 'block'; //toca o gif de aposta
  fazAposta('cara');
});

botaoCoroa.addEventListener('click', function (){
  gifInicio.style.display = 'none';
  reiniciarGif(gifMoeda, gifMoeda.src); 
  gifMoeda.style.display = 'block';
  fazAposta('coroa');
});

function fazAposta(apostaEm) {
    const valorAposta = parseFloat(valorApostaInput.value); //transforma a string digitada em float

    if(valorAposta <= 0){ // se digitar dinheiro negativo
        alert("Por favor, insira um valor válido para a aposta.");
        gifInicio.style.display = 'block'; // nao deixa com que o gif mude
        gifMoeda.style.display = 'none'; // =
        return;
    }

    if(valorAposta > dinheiro){ //se digitar mais dinheiro do que o usuario possui
        alert("Saldo insuficiente para esta aposta.");
        gifInicio.style.display = 'block'; // nao deixa com que o gif mude
        gifMoeda.style.display = 'none'; // =
        return;
    }

    const ladoSorteado = obtemLadoMoeda();

    setTimeout(() =>{  //funcao para que espere um tempo para que se execute o codigo (espera o tempo ate que o gif termine de rodar)

    if(apostaEm == ladoSorteado){ //se o usuario clicar no botao que corresponde ao lado da moeda
        dinheiro += valorAposta; 
        resultado.innerText = `Você ganhou R$${valorAposta} ! O resultado foi ${ladoSorteado}.`;
    }else{
        dinheiro -= valorAposta;
        resultado.innerText = `Você perdeu R$${valorAposta} ... O resultado foi ${ladoSorteado}.`;
    }

    atualizarCarteira(); //atualiza a carteira com mais ou menos dinheiro
    }, 4000);
}


atualizarCarteira(); 