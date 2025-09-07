/* 
    [Variáveis globais]
*/
// Lista com nomes das categorias, utilizado para 
// atualização dinâmica da interface
const listaCategorias = [
        "campanhas","pessoas","dados-bancarios","alertas-desastres","municipios"
];
// Nome da categoria selecionada
let categoriaSelecionada = null;

// ID no banco do registro selecionado
let registroSelecionadoId= null;





/* 
    [Mocks]
*/

// Simular consumo da API do projeto

// Campanhas
// Simular objetos contidos na lista retornada pela API
const campanha1 = {
    "id":1,
    "titulo":"Plante uma árvore",
    "descricao":"Ajude a plantar uma árvore por apenas R$0,25.",
    "site":null,
    "pessoa_id":null,
    "dados_bancarios_id":null
}
const campanha2 = {
    "id":2,
    "titulo":"Arrecadação",
    "descricao":"Doe qualquer valor para ajudar as pessoas afetadas pelas fortes chuvas.",
    "site":null,
    "pessoa_id":null,
    "dados_bancarios_id":null
}
// Simular a lista de objetos a ser retornada pela API
const mockListaCampanhas = [
    campanha1, campanha2
]
// GET /admin/campanhas
function solicitarRegistrosCampanhas(){
    return mockListaCampanhas;
}





/* 
    [Controle da página]
*/

// Chamado ao trocar de categoria
function limparRegistroSelecionadoId(){
    registroSelecionadoId = null;
}

// Limpa os inputs do formulário
function limparFormulario(){
    const listaDeInputs = document.querySelectorAll("input[type=text]");
    listaDeInputs.forEach(inp=>{
        inp.value = "";
    });
}

function atualizarFormRegistroSelecionado(registroJSON){
    switch (categoriaSelecionada) {
        case "campanhas":
            atualizaFormCampanha(registroJSON);
            break;
        default:
            break;
    }
}

// Atualizar o header da página
function atualizarHeader(){
    // Display da categoria selecionada
    const displayCategoriaSelecionada = document.getElementById("display-categoria-selecionada");
    if(categoriaSelecionada===null){
        displayCategoriaSelecionada.textContent = "Nenhuma categoria selecionada";
    }
    else{
        const categoriaSelecionadaMaiuscula = categoriaSelecionada.charAt(0).toUpperCase() + categoriaSelecionada.slice(1);
        displayCategoriaSelecionada.textContent = `Categoria selecionada: ${categoriaSelecionadaMaiuscula}`;
    }
}

// Carrega formulário
function carregarFormulario(){
    // Alterar visibilidade dos containers de formulário tendo como base a categoria selecionada
    listaCategorias.forEach(item=>{
        const formulario = document.getElementById(`form-${item}`);
        // Visível
        if(categoriaSelecionada===item){
            if(formulario!==null){formulario.style.display = "flex";}
        }
        // Oculto
        else{
            if(formulario!==null){formulario.style.display = "none";}
        }
    });
}

// Carregar registros
function carregarRegistros(){
    // Container principal
    const containerRegistros = document.getElementById("registros");
    // Container contendo todos os registros individuais
    const containerRegistrosScroll = document.getElementById("registros-scroll");
    // Usado para defininr a lista de registros ativa no momento
    let listaDeRegistrosJSON = [];
    // Definir a lista de registros ativa
    switch (categoriaSelecionada) {
        case "campanhas":
            listaDeRegistrosJSON = solicitarRegistrosCampanhas();
            break;
        default:
            listaDeRegistrosJSON = [];
            break;
    }
    if(listaDeRegistrosJSON.length>0){
        containerRegistros.style.display = "flex";
        listaDeRegistrosJSON.forEach(registroJSON=>{
            // Criar um container para cada registro individual
            // usando a classe CSS item-registro
            let itemRegistro = document.createElement("div");
            itemRegistro.className="item-registro";
            // Criar agora elementos h5 para cada chave-valor do JSON
            // bem como adicionar o elemento h5 como filho de itemRegistro
            for(let chave in registroJSON){
                let novoH5 = document.createElement("h5");
                novoH5.className = "item-registro-campo";
                novoH5.textContent = `${chave}: ${registroJSON[chave]}`;
                itemRegistro.appendChild(novoH5);
            }
            // Botão de selecionar registro
            let btSelecionarRegistro = document.createElement("button");
            btSelecionarRegistro.textContent = "Selecionar";
            btSelecionarRegistro.addEventListener("click",()=>{
                atualizarFormRegistroSelecionado(registroJSON);
            })
            itemRegistro.appendChild(btSelecionarRegistro);
            containerRegistrosScroll.appendChild(itemRegistro);
        })
    }
    else{
        containerRegistros.style.display = "none";
        containerRegistrosScroll.innerHTML = "";
    }
}

// Atualizar o formulário referente a campanha
// quando um novo registro é selecionado
function atualizaFormCampanha(registroJSON){
    registroSelecionadoId = registroJSON["id"];
    const displayId = document.getElementById("display-campanha-selecionada-id");
    const inpTitulo = document.getElementById("inp-campanha-titulo");
    const inpDescricao = document.getElementById("inp-campanha-descricao");
    const inpSite = document.getElementById("inp-campanha-site");
    const inpPessoaId = document.getElementById("inp-campanha-pessoa-id");
    const inpDadosBancariosId = document.getElementById("inp-campanha-dados-bancarios-id");
    displayId.textContent = `ID Selecionado: ${registroJSON["id"]}`;
    inpTitulo.value = registroJSON["titulo"];
    inpDescricao.value = registroJSON["descricao"];
    inpSite.value = registroJSON["site"];
    inpPessoaId.value = registroJSON["pessoa_id"];
    inpDadosBancariosId.value = registroJSON["dados_bancarios_id"];
}



// Adicionar eventos de click nos botões de selecionar categoria
listaCategorias.forEach(nomeCategoria=>{
    const bt = document.getElementById(`bt-${nomeCategoria}`);
    if(bt!==null){
        bt.addEventListener("click",()=>{
            categoriaSelecionada = nomeCategoria;
            atualizarHeader();
            carregarFormulario();
            limparFormulario();
            carregarRegistros();
            limparRegistroSelecionadoId();
        })
    }
});

// Ao carregar a página
atualizarHeader();
carregarFormulario();
carregarRegistros();