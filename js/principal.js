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





//_______________________________________________________________________________________________
/* Consumo da API Eco */
const apiBaseUrl = "http://localhost:8080";

async function apiRequest(endpoint, method="GET", body=null) {
    const options = { method, headers: {} };
    if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${apiBaseUrl}${endpoint}`, options);
    if (!res.ok) throw new Error("Erro na requisição: " + res.status);
    if(method==="DELETE"){
        return [];
    }
    return res.json();
}

// Exemplos de uso:
// const campanhas = await apiRequest("/admin/campanhas");
// await apiRequest("/admin/campanhas", "POST", campanha);
// await apiRequest(`/admin/campanhas/${id}`, "PUT", campanha);






//_______________________________________________________________________________________________
/* 
    [Controle da página]
*/

// Função com retorno bool para indicar se um input esta vazio
function inputEstaVazio(valor){
    if(valor===""||valor===undefined||valor===null){
        return true;
    }
    else{
        return false;
    }
}

// Chamado ao trocar de categoria
function limparRegistroSelecionadoId(){
    registroSelecionadoId = null;
}

// Limpa os inputs do formulário
function limparTodosFormularios(){
    const listaDeInputs = document.querySelectorAll("input[type=text]");
    listaDeInputs.forEach(inp=>{
        inp.value = "";
    });
}

function selecionarRegistro(registroJson){
    switch (categoriaSelecionada) {
        case "campanhas":
            controleFormCampanha("carregar",registroJson);
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
async function carregarRegistrosDaCategoria(){
    // Container principal
    const containerRegistros = document.getElementById("registros");
    // Container contendo todos os registros individuais
    const containerRegistrosScroll = document.getElementById("registros-scroll");
    containerRegistrosScroll.innerHTML = "";
    // Usado para defininr a lista de registros ativa no momento
    let listaDeRegistrosJSON = [];
    // Definir a lista de registros ativa
    switch (categoriaSelecionada) {
        case "campanhas":
            listaDeRegistrosJSON = await apiRequest("/admin/campanhas");
            break;
        case "pessoas":
            listaDeRegistrosJSON = await apiRequest("/admin/pessoas");
            break;
        case "dados-bancarios":
            listaDeRegistrosJSON = await apiRequest("/admin/dados-bancarios");
            break;
        case "municipios":
            listaDeRegistrosJSON = await apiRequest("/admin/municipios");
            break;
        case "alertas-desastres":
            listaDeRegistrosJSON = await apiRequest("/admin/alertas-desastres");
            break;
        default:
            listaDeRegistrosJSON = [];
            break;
    }
    if(listaDeRegistrosJSON.length>0){
        containerRegistros.style.display = "flex";
        listaDeRegistrosJSON.forEach(registroJson=>{
            // Criar um container para cada registro individual
            // usando a classe CSS item-registro
            let itemRegistro = document.createElement("div");
            itemRegistro.className="item-registro";
            // Criar agora elementos h5 para cada chave-valor do JSON
            // bem como adicionar o elemento h5 como filho de itemRegistro
            for(let chave in registroJson){
                let novoH5 = document.createElement("h5");
                novoH5.className = "item-registro-campo";
                novoH5.textContent = `${chave}: ${registroJson[chave]}`;
                itemRegistro.appendChild(novoH5);
            }
            // Botão de selecionar registro
            let btSelecionarRegistro = document.createElement("button");
            btSelecionarRegistro.textContent = "Selecionar";
            btSelecionarRegistro.addEventListener("click",()=>{
                selecionarRegistro(registroJson);
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

// Controle do formulário de campanha
async function controleFormCampanha(acao="limpar", registroJson={}){
    const displayId = document.getElementById("display-campanha-selecionada-id");
    const inpTitulo = document.getElementById("inp-campanha-titulo");
    const inpDescricao = document.getElementById("inp-campanha-descricao");
    const inpSite = document.getElementById("inp-campanha-site");
    const inpPessoaId = document.getElementById("inp-campanha-pessoa-id");
    const inpDadosBancariosId = document.getElementById("inp-campanha-dados-bancarios-id");
    if(acao==="limpar"){
        limparRegistroSelecionadoId();
        displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
        limparTodosFormularios();
    }
    else if(acao==="carregar"){
        registroSelecionadoId = registroJson["id"];
        displayId.textContent = `ID Selecionado: ${registroJson["id"]}`;
        inpTitulo.value = registroJson["titulo"];
        inpDescricao.value = registroJson["descricao"];
        inpSite.value = registroJson["site"];
        inpPessoaId.value = registroJson["pessoaId"];
        inpDadosBancariosId.value = registroJson["dadosBancariosId"];    
    }
    else if(acao==="criar"||acao==="atualizar"){
        const bodyRequisicao = {
            "titulo": inputEstaVazio(inpTitulo.value) ? "Inválido" : inpTitulo.value,
            "descricao": inputEstaVazio(inpDescricao.value) ? "Inválido" : inpDescricao.value,
            "site": inputEstaVazio(inpSite.value) ? null : inpSite.value,
            "pessoaId": inputEstaVazio(inpPessoaId.value) ? null : parseInt(inpPessoaId.value),
            "dadosBancariosId": inputEstaVazio(inpDadosBancariosId.value) ? null : parseInt(inpDadosBancariosId.value)
        }
        if(acao==="criar"){
            limparRegistroSelecionadoId();
            displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
            await apiRequest("/admin/campanhas","POST",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
        else{
            await apiRequest(`/admin/campanhas/${registroSelecionadoId}`,"PUT",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
    }
    else if(acao==="remover"){
        await apiRequest(`/admin/campanhas/${registroSelecionadoId}`, "DELETE");
        limparRegistroSelecionadoId();
        carregarRegistrosDaCategoria();
    }
    else{
        console.log("Erro em controleFormCampanha(): Argumento 'acao' inválido.")
    }
}

// Controle do formulário de pessoas
async function controleFormPessoas(acao="limpar", registroJson={}){
    const displayId = document.getElementById("display-pessoa-selecionada-id");
    const inpNome = document.getElementById("inp-pessoa-nome");
    const inpCpf = document.getElementById("inp-pessoa-cpf");
    const inpCnpj = document.getElementById("inp-pessoa-cnpj");
    const inpRg = document.getElementById("inp-pessoa-rg");
    const inpTelefone = document.getElementById("inp-pessoa-telefone");
    const inpEmail = document.getElementById("inp-pessoa-email");

    if(acao==="limpar"){
        limparRegistroSelecionadoId();
        displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
        limparTodosFormularios();
    }
    else if(acao==="carregar"){
        registroSelecionadoId = registroJson["id"];
        displayId.textContent = `ID Selecionado: ${registroJson["id"]}`;
        inpNome.value = registroJson["nome"];
        inpCpf.value = registroJson["cpf"];
        inpCnpj.value = registroJson["cnpj"];
        inpRg.value = registroJson["rg"];
        inpTelefone.value = registroJson["telefone"];
        inpEmail.value = registroJson["email"];
    }
    else if(acao==="criar"||acao==="atualizar"){
        const bodyRequisicao = {
            "nome": inputEstaVazio(inpTitulo.value) ? "Inválido" : inpTitulo.value,
            "cpf": inputEstaVazio(inpDescricao.value) ? null : inpDescricao.value,
            "cnpj": inputEstaVazio(inpSite.value) ? null : inpSite.value,
            "rg": inputEstaVazio(inpPessoaId.value) ? null : inpPessoaId.value,
            "telefone": inputEstaVazio(inpDadosBancariosId.value) ? "Inválido" : parseInt(inpDadosBancariosId.value),
            "email": inputEstaVazio(inpDadosBancariosId.value) ? "Inválido" : parseInt(inpDadosBancariosId.value)

        }
        if(acao==="criar"){
            limparRegistroSelecionadoId();
            displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
            await apiRequest("/admin/pessoas","POST",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
        else{
            await apiRequest(`/admin/pessoas/${registroSelecionadoId}`,"PUT",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
    }
    else if(acao==="remover"){
        await apiRequest(`/admin/pessoas/${registroSelecionadoId}`, "DELETE");
        limparRegistroSelecionadoId();
        carregarRegistrosDaCategoria();
    }
    else{
        console.log("Erro em controleFormCampanha(): Argumento 'acao' inválido.")
    }
}


//_______________________________________________________________________________________________
/*
    Configurar eventos
*/
function configurarEventos(){
    // Adicionar eventos de click nos  botões
    // Botões de selecionar categoria
    listaCategorias.forEach(nomeCategoria=>{
        const bt = document.getElementById(`bt-${nomeCategoria}`);
        if(bt!==null){
            bt.addEventListener("click",()=>{
                categoriaSelecionada = nomeCategoria;
                atualizarHeader();
                carregarFormulario();
                limparTodosFormularios();
                carregarRegistrosDaCategoria();
                limparRegistroSelecionadoId();
            })
        }
    });
    // Botões do formulário de campanha
    document.getElementById("bt-criar-campanha").addEventListener("click",()=>{
        controleFormCampanha("criar");
    });
    document.getElementById("bt-atualizar-campanha").addEventListener("click",()=>{
        controleFormCampanha("atualizar");
    });
    document.getElementById("bt-remover-campanha").addEventListener("click",()=>{
        controleFormCampanha("remover");
    });
}

// Ao carregar a página
configurarEventos();
atualizarHeader();
carregarFormulario();
carregarRegistrosDaCategoria();