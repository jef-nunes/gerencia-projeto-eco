/* 
    [Variáveis de estado]
*/

// Nome da categoria selecionada
export let categoriaSelecionada = null;

// ID no banco do registro selecionado
export let registroSelecionadoId= null;

export function setCategoriaSelecionada(v){ categoriaSelecionada = v; }
export function setRegistroSelecionadoId(v){ registroSelecionadoId = v; }