const CTRL_ANTERIOR = document.querySelector(".js-anterior");
const CTRL_PROXIMO = document.querySelector(".js-proximo");
const ELEM_LISTA_MINIATURAS = document.querySelector('.lista-miniaturas');
const ELEM_VISUALIZADOR_ZOOM = document.querySelector(".visualizador-zoom");
const LISTA_MINIATURAS = document.querySelectorAll(".caixa-miniatura:not(.mais-imagens) img");
const LISTA_PONTOS = document.querySelectorAll(".ponto");
const MOSTRADOR_INDICE = document.querySelector(".mostrador-indice");
var indiceImagemEmExibicao = 0;

window.onload = function() {
    for (let i = 0, qtdImagens = LISTA_MINIATURAS.length; i < qtdImagens; i++) {
        LISTA_MINIATURAS[i].addEventListener('click', miniaturaClicada);
    }

    for (let i = 0, qtdPontos = LISTA_PONTOS.length; i < qtdPontos; i++) {
        LISTA_PONTOS[i].addEventListener('click', pontoClicado);
    }

    CTRL_ANTERIOR.addEventListener('click', passarImagem);
    CTRL_PROXIMO.addEventListener('click', passarImagem);
    ELEM_VISUALIZADOR_ZOOM.addEventListener('mousemove', zoomImagemSelecionada);
    ELEM_LISTA_MINIATURAS.addEventListener('mousedown', scrollListaMiniaturas);

    document.addEventListener('dragstart', function(e){
        if(e.target.tagName=="IMG"){
            e.preventDefault();
        }
    });

    window.addEventListener('resize', redimensionarElementos);

    reiniciarGaleria();
    redimensionarElementos();
};

function reiniciarGaleria(){
    LISTA_MINIATURAS[0].click();
}

function alternarClasse(elemento, classe, adicionar){
    elemento.classList.toggle(classe, adicionar);
}

function encontrarIndiceClicado(listaFilhos, filhoSelecionado){
    return Array.prototype.indexOf.call(listaFilhos, filhoSelecionado);
}

function miniaturaClicada(e){
    let listaCaixasMiniaturas = ELEM_LISTA_MINIATURAS.children;
    let caixaMiniaturaClicada = e.target.parentElement;

    let indice = encontrarIndiceClicado(listaCaixasMiniaturas, caixaMiniaturaClicada);
    aplicarNovaSelecaoImagem(indice);
}

function pontoClicado(e){
    let pontoClicado = e.target;

    let indice = encontrarIndiceClicado(LISTA_PONTOS, pontoClicado);
    aplicarNovaSelecaoImagem(indice);
}

function passarImagem(e){
    let controleSelecionado = e.target;
    let fatorPassagem = 0;

    let ehProximo = controleSelecionado.classList.contains('js-proximo');
    ehProximo ? fatorPassagem = 1 : fatorPassagem = -1;

    aplicarNovaSelecaoImagem(indiceImagemEmExibicao + (fatorPassagem));
}

function aplicarNovaSelecaoImagem(indiceSelecionado){
    atualizarImagemSelecionada(indiceSelecionado);
    atualizarCaixaMiniaturaSelecionada(indiceSelecionado);
    atualizarPontoSelecionado(indiceSelecionado);
    atualizarEstadoControles(indiceSelecionado);
    atualizarIndiceImagemExibicao(indiceSelecionado);
}

function atualizarImagemSelecionada(indiceSelecionado){
    let miniaturaSelecionada = LISTA_MINIATURAS[indiceSelecionado];
    let elemImagemSelecionada = document.querySelector(".imagem-selecionada");
    elemImagemSelecionada.src = miniaturaSelecionada.src;
    ELEM_VISUALIZADOR_ZOOM.style.backgroundImage = "url(" + miniaturaSelecionada.src + ")";
    

    let caixaThumbSelecionada = document.querySelectorAll(".caixa-miniatura")[indiceSelecionado];
    caixaThumbSelecionada.scrollIntoView({behavior: "smooth", inline: "center"});
}

function atualizarCaixaMiniaturaSelecionada(indiceSelecionado){
    ELEM_LISTA_MINIATURAS.children[indiceImagemEmExibicao].classList.remove("caixa-miniatura--is-selecao");
    ELEM_LISTA_MINIATURAS.children[indiceSelecionado].classList.add("caixa-miniatura--is-selecao");
}

function atualizarPontoSelecionado(indiceSelecionado){
    LISTA_PONTOS[indiceImagemEmExibicao].classList.remove("ponto--is-selecao");
    LISTA_PONTOS[indiceSelecionado].classList.add("ponto--is-selecao");
}

function atualizarEstadoControles(indiceSelecionado){
    let classeModificadora = "controle--is-inativo";
    let ehPrimeiroSlide = indiceSelecionado == 0;
    let ehUltimoSlide = indiceSelecionado + 1 ==  ELEM_LISTA_MINIATURAS.childElementCount;

    alternarClasse(CTRL_ANTERIOR, classeModificadora, ehPrimeiroSlide);
    alternarClasse(CTRL_PROXIMO, classeModificadora, ehUltimoSlide);
}

function atualizarIndiceImagemExibicao(indiceSelecionado){
    indiceImagemEmExibicao = indiceSelecionado;
    let qtdImagens = ELEM_LISTA_MINIATURAS.childElementCount;

    MOSTRADOR_INDICE.innerHTML = `${(indiceSelecionado + 1)} / ${qtdImagens}`;
}

function zoomImagemSelecionada(e){
    var zoomer = e.currentTarget;
    e.offsetX ? offsetX = e.offsetX : e.touches != undefined ? offsetX = e.touches[0].pageX : 0;
    e.offsetY ? offsetY = e.offsetY : e.touches != undefined ? offsetX = e.touches[0].pageX : 0;

    if(offsetX && offsetY){
        x = offsetX/zoomer.offsetWidth*100;
        y = offsetY/zoomer.offsetHeight*100;
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
    }
}

var posicaoScrollListaMiniaturas = {esquerda: 0, mouseX: 0}

function scrollListaMiniaturas(e){
    posicaoScrollListaMiniaturas = {
        esquerda: ELEM_LISTA_MINIATURAS.scrollLeft,
        mouseX: e.clientX
    };

    document.addEventListener('mousemove', executarMovimentoScroll);
    document.addEventListener('mouseup', removerEventosScroll);
}

function executarMovimentoScroll(e) {
    const diferencaX = e.clientX - posicaoScrollListaMiniaturas.mouseX;
    ELEM_LISTA_MINIATURAS.scrollLeft = posicaoScrollListaMiniaturas.esquerda - diferencaX;
};

function removerEventosScroll(e){
    document.removeEventListener('mousemove', executarMovimentoScroll);
    document.removeEventListener('mouseup', removerEventosScroll);
}

function redimensionarElementos(){
    let tamanhoVisualizadorZoom = ELEM_VISUALIZADOR_ZOOM.offsetWidth;   
      
    let textoQuantidadeImagens = document.querySelector(".mais-imagens label");
    if(textoQuantidadeImagens != undefined){
        textoQuantidadeImagens.style.fontSize = `${tamanhoVisualizadorZoom * 0.06}px`;
    }

    let textoSeloDesconto = document.querySelectorAll(".selo-desconto label");
    if(textoSeloDesconto != undefined){
        textoSeloDesconto[0].style.fontSize = `${tamanhoVisualizadorZoom * 0.024}px`;
        textoSeloDesconto[1].style.fontSize = `${tamanhoVisualizadorZoom * 0.024}px`;
    }

    for (let i = 0, qtdPontos = LISTA_PONTOS.length; i < qtdPontos; i++) {
        LISTA_PONTOS[i].style.width = `${tamanhoVisualizadorZoom * 0.016}px`;
        LISTA_PONTOS[i].style.height = `${tamanhoVisualizadorZoom * 0.016}px`;
        LISTA_PONTOS[i].style.margin = `0 ${tamanhoVisualizadorZoom * 0.006 }px`
    }

    let efeitoFade = document.querySelector(".efeito-fade");
    if(efeitoFade != undefined){
        efeitoFade.style.width = `${tamanhoVisualizadorZoom * 0.05}px`;
        efeitoFade.style.height = `${tamanhoVisualizadorZoom * 0.13}px`;
    }


    // let setas = document.getElementsByClassName("seta");
    // if(setas){
    //     setas[0].style.fontSize = (tamanhoCaixaThumb * 0.7774).toString() + "px";
    //     setas[1].style.fontSize = (tamanhoCaixaThumb * 0.7774).toString() + "px";
    // }    

    // let mostradorIndice = document.getElementsByClassName('mostrador-indice"')[0];
    // if(mostradorIndice != undefined){
    //     mostradorIndice.style.fontSize = (tamanhoVisualizadorZoom * 0.02).toString() + "px";
    // }
}