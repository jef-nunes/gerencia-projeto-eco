/*
    [Formulários]
*/

import { registroSelecionadoId } from "./estado.js";
import { textoInvalidoPlaceholder, validacoes, validar } from "./validar.js";

// Limpa os inputs de todos os formulários
export function limparTodosFormularios(){
    const listaDeInputs = document.querySelectorAll("input[type=text]");
    listaDeInputs.forEach(inp=>{
        inp.value = "";
    });
}

// Controle do formulário de campanhas
export async function formCampanhas(acao="limpar", registroJson={}){
    // Exibe o ID do registro selecionado
    const displayId = document.getElementById("display-campanha-selecionada-id");
    // Campos de input do formulário
    const inpTitulo = document.getElementById("inp-campanha-titulo");
    const inpDescricao = document.getElementById("inp-campanha-descricao");
    const inpSite = document.getElementById("inp-campanha-site");
    const inpPessoaId = document.getElementById("inp-campanha-pessoa-id");
    const inpDadosBancariosId = document.getElementById("inp-campanha-dados-bancarios-id");
    // Prosseguir de acordo com o argumento acao
    // Limpar os inputs de todos os formulário
    if(acao==="limpar"){
        limparRegistroSelecionadoId();
        displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
        limparTodosFormularios();
    }
    // Carregar valores para dentro dos inputs
    else if(acao==="carregar"){
        registroSelecionadoId = registroJson["id"];
        displayId.textContent = `ID Selecionado: ${registroJson["id"]}`;
        inpTitulo.value = registroJson["titulo"];
        inpDescricao.value = registroJson["descricao"];
        inpSite.value = registroJson["site"];
        inpPessoaId.value = registroJson["pessoaId"];
        inpDadosBancariosId.value = registroJson["dadosBancariosId"];    
    }
    // Ações de envio do formulário
    // Criar ou atualizar registro
    else if(acao==="criar"||acao==="atualizar"){
        // Abaixo será criado um objeto JSON que será o body da requisição HTTP.
        // Cada campo do objeto será validado usando a função validar() e 
        // em caso de um campo não ser válido ele receberá um placeholder
        // cujo valor é a string "[Inválido]" a qual serve para marcar o campo
        // como inválido para tratamento posterior
        const bodyRequisicao = {

            "titulo": validar(inpTitulo.value,[validacoes.naoNulo,validacoes.naoVazio]) ? inpTitulo.value : textoInvalidoPlaceholder,

            "descricao": validar(inpDescricao.value,[validacoes.naoNulo,validacoes.naoVazio]) ? inpDescricao.value : textoInvalidoPlaceholder ,

            "site": validar(inpSite.value,[validacoes.linkSite]) ? inpSite.value : textoInvalidoPlaceholder,

            "pessoaId": validar(inpPessoaId.value,[validacoes.numero]) ? parseInt(inpPessoaId.value) : textoInvalidoPlaceholder,

            "dadosBancariosId": validar(inpDadosBancariosId.value,[validacoes.numero]) ? parseInt(inpDadosBancariosId.value) : textoInvalidoPlaceholder
        }
        // Exibir mensagens de alerta para cada campo inválido
        if(bodyRequisicao["titulo"]===invalido){
            alert("Insira um título válido");
        }
        // Se todos os campos forem válidos prosseguir com a requisição HTTP
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
    // Remover registro
    else if(acao==="remover"){
        await apiRequest(`/admin/campanhas/${registroSelecionadoId}`, "DELETE");
        limparRegistroSelecionadoId();
        carregarRegistrosDaCategoria();
    }
    else{
        console.log("Erro em formCampanhas(): Argumento 'acao' inválido.")
    }
}

// Controle do formulário de pessoas
export async function formPessoas(acao="limpar", registroJson={}){
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
            "nome": validar(inpNome.value) ? "Inválido" : inpNome.value,
            "cpf": validar(inpCpf.value) ? null : inpCpf.value,
            "cnpj": validar(inpCnpj.value) ? null : inpCnpj.value,
            "rg": validar(inpRg.value) ? null : inpRg.value,
            "telefone": validar(inpTelefone.value) ? "Inválido" : inpTelefone.value,
            "email": validar(inpEmail.value) ? "Inválido" : inpEmail.value

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
        console.log("Erro em formPessoas(): Argumento 'acao' inválido.")
    }
}

// Controle do formulário de dados bancários
export async function formDadosBancarios(acao="limpar", registroJson={}){
    const displayId = document.getElementById("display-dados-bancarios-selecionado-id");
    const inpBanco= document.getElementById("inp-dados-bancarios-banco");
    const inpAgencia = document.getElementById("inp-dados-bancarios-agencia");
    const inpConta = document.getElementById("inp-dados-bancarios-conta");
    const inpChavePix = document.getElementById("inp-dados-bancarios-chave-pix");

    if(acao==="limpar"){
        limparRegistroSelecionadoId();
        displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
        limparTodosFormularios();
    }
    else if(acao==="carregar"){
        registroSelecionadoId = registroJson["id"];
        displayId.textContent = `ID Selecionado: ${registroJson["id"]}`;
        inpBanco.value = registroJson["banco"];
        inpAgencia.value = registroJson["agencia"];
        inpConta.value = registroJson["conta"];
        inpChavePix.value = registroJson["chavePix"];
    }
    else if(acao==="criar"||acao==="atualizar"){
        const bodyRequisicao = {
            "banco": validar(inpBanco.value) ? "Inválido" : inpBanco.value,
            "agencia": validar(inpAgencia.value) ? null : inpAgencia.value,
            "conta": validar(inpConta.value) ? null : inpConta.value,
            "chavePix": validar(inpChavePix.value) ? null : inpChavePix.value,
        }
        if(acao==="criar"){
            limparRegistroSelecionadoId();
            displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
            await apiRequest("/admin/dados-bancarios","POST",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
        else{
            await apiRequest(`/admin/dados-bancarios/${registroSelecionadoId}`,"PUT",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
    }
    else if(acao==="remover"){
        await apiRequest(`/admin/dados-bancarios/${registroSelecionadoId}`, "DELETE");
        limparRegistroSelecionadoId();
        carregarRegistrosDaCategoria();
    }
    else{
        console.log("Erro em formDadosBancarios(): Argumento 'acao' inválido.")
    }
}

// Controle do formulário de municípios
export async function formMunicipios(acao="limpar", registroJson={}){
    const displayId = document.getElementById("display-municipio-selecionado-id");
    const inpNome = document.getElementById("inp-municipio-nome");
    const inpEstado = document.getElementById("inp-municipio-estado");
    const inpRegiao = document.getElementById("inp-municipio-regiao");

    if(acao==="limpar"){
        limparRegistroSelecionadoId();
        displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
        limparTodosFormularios();
    }
    else if(acao==="carregar"){
        registroSelecionadoId = registroJson["id"];
        displayId.textContent = `ID Selecionado: ${registroJson["id"]}`;
        inpNome = registroJson["nome"];
        inpEstado = registroJson["estado"];
        inpRegiao = registroJson["regiao"];
    }
    else if(acao==="criar"||acao==="atualizar"){
        const bodyRequisicao = {
            "nome": validar(inpNome.value) ? "Inválido" : inpNome.value,
            "estado": validar(inpEstado.value) ? "Inválido" : inpEstado.value,
            "regiao": validar(inpRegiao.value) ? "Inválido" : inpRegiao.value
        }
        if(acao==="criar"){
            limparRegistroSelecionadoId();
            displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
            await apiRequest("/admin/municipios","POST",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
        else{
            await apiRequest(`/admin/municipios/${registroSelecionadoId}`,"PUT",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
    }
    else if(acao==="remover"){
        await apiRequest(`/admin/municipios/${registroSelecionadoId}`, "DELETE");
        limparRegistroSelecionadoId();
        carregarRegistrosDaCategoria();
    }
    else{
        console.log("Erro em formMunicipios(): Argumento 'acao' inválido.")
    }
}

// Controle do formulário de alertas de desastre
export async function formAlertasDesastres(acao="limpar", registroJson={}){
    const displayId = document.getElementById("display-alerta-desastre-selecionado-id");
    const inpTitulo = document.getElementById("inp-alerta-desastre-titulo");
    const inpDescricao = document.getElementById("inp-alerta-desastre-descricao");
    const inpNivel = document.getElementById("inp-alerta-desastre-nivel");
    const inpCategoria = document.getElementById("inp-alerta-desastre-categoria");
    const inpData = document.getElementById("inp-alerta-desastre-data");

    if(acao==="limpar"){
        limparRegistroSelecionadoId();
        displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
        limparTodosFormularios();
    }
    else if(acao==="carregar"){
        registroSelecionadoId = registroJson["id"];
        displayId.textContent = `ID Selecionado: ${registroJson["id"]}`;
        inpTitulo = registroJson["titulo"];
        inpDescricao = registroJson["descricao"];
        inpNivel = registroJson["nivel"];
        inpCategoria = registroJson["categoria"];
        inpData = registroJson["data"];
    }
    else if(acao==="criar"||acao==="atualizar"){
        const bodyRequisicao = {
            "titulo": validar(inpTitulo.value) ? "Inválido" : inpTitulo.value,
            "descricao": validar(inpDescricao.value) ? null : inpDescricao.value,
            "nivel": validar(inpNivel.value) ? "Inválido" : inpNivel.value,
            "categoria": validar(inpCategoria.value) ? "Inválido" : inpCategoria.value,
            "data": validar(inpData.value) ? "Inválido" : inpData.value,
        }
        if(acao==="criar"){
            limparRegistroSelecionadoId();
            displayId.textContent = `ID Selecionado: ${registroSelecionadoId}`;
            await apiRequest("/admin/alertas-desastres","POST",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
        else{
            await apiRequest(`/admin/alertas-desastres/${registroSelecionadoId}`,"PUT",bodyRequisicao);
            carregarRegistrosDaCategoria();
        }
    }
    else if(acao==="remover"){
        await apiRequest(`/admin/alertas-desastres/${registroSelecionadoId}`, "DELETE");
        limparRegistroSelecionadoId();
        carregarRegistrosDaCategoria();
    }
    else{
        console.log("Erro em formMunicipios(): Argumento 'acao' inválido.")
    }
}