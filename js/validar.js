/*
    [Validações de texto]
*/

const regexNomeProprio = /^[\p{L} \-]+$/u;

export const textoInvalidoPlaceholder = "[Inválido]";

export const validacoes = {
    nomeProprio: "nome-proprio",
    naoVazio: "nao-vazio",
    naoNulo: "nao-nulo",
    email: "email",
    numero: "numero",
    linkSite: "link-site"
}

export function validar(texto,opcoes=[]){
    let valido = true;
    opcoes.forEach(o=>{
        // Não nulo
        if(o==="nao-nulo"){
            if(texto===null){
                valido = false;
            }
        }
        // Não vazio
        else if(o==="nao-vazio"){
            if(texto.trim()===";"){
                valido=false
            }
        }
        // Email
        else if(o==="email"){
            if(!texto.includes("@")){
                valido=false;
            }
        }
        // Número 
        else if(o==="numero"){
            if(!isNaN(Number(texto))){
                valido=false;
            }
        }
        // Nome próprio
        else if(o==="nome-proprio"){
            if(!regexNomeProprio.test(texto)){
                valido = false;
            }
        }
        // Link site
        else if(o==="link-site"){
            // ...
        }
    });
    return valido;
}

// Exemplo de uso
// let texto = "exemplo@email.com"
// validar(texto,["vazio","email"])