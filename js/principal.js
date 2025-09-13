/* 
    [Principal: Controle de fluxo, interatividade e eventos]
*/

import { listaCategorias } from "./constantes.js";
import { apiRequest } from "./api.js";
import { categoriaSelecionada, setCategoriaSelecionada, setRegistroSelecionadoId } from "./estado.js";
import { formCampanhas, formPessoas, formDadosBancarios,
        formMunicipios, formAlertasDesastres, limparTodosFormularios } from "./formularios.js";


// Ao selecionar um registro, carregar os dados do registro
// nos inputs do respectivo formulário
function selecionarRegistro(registroJson){
    switch (categoriaSelecionada) {
        case "campanhas":
            formCampanhas("carregar",registroJson);
            break;
        case "pessoas":
            formPessoas("carregar",registroJson);
            break;
        case "dados-bancarios":
            formDadosBancarios("carregar",registroJson);
            break;
        case "municipios":
            formMunicipios("carregar",registroJson);
            break;
        case "alertas-desastres":
            formAlertasDesastres("carregar",registroJson);
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
    listaCategorias.forEach(categoria=>{
        const formulario = document.getElementById(`form-${categoria}`);
        // Visível
        if(categoriaSelecionada===categoria){
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

// Configurar eventos
function configurarEventos(){
    // Adicionar eventos de click nos  botões
    // Botões de selecionar categoria
    listaCategorias.forEach(categoria=>{
        const bt = document.getElementById(`bt-${categoria}`);
        if(bt!==null){
            bt.addEventListener("click",()=>{
                setCategoriaSelecionada(categoria);
                atualizarHeader();
                carregarFormulario();
                limparTodosFormularios();
                carregarRegistrosDaCategoria();
                setRegistroSelecionadoId(null);
            })
        }
    });
    // Botões do formulário de campanha
    document.getElementById("bt-criar-campanha").addEventListener("click",()=>{
        formCampanhas("criar");
    });
    document.getElementById("bt-atualizar-campanha").addEventListener("click",()=>{
        formCampanhas("atualizar");
    });
    document.getElementById("bt-remover-campanha").addEventListener("click",()=>{
        formCampanhas("remover");
    });
}

// Ao carregar a página
configurarEventos();
atualizarHeader();
carregarFormulario();
carregarRegistrosDaCategoria();