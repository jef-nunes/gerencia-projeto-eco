/* 
    [Consumo da API do Sistema]
*/

const apiBaseUrl = "http://localhost:8080";

export async function apiRequest(endpoint, method="GET", body=null) {
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
//
//      GET - Listar todas as campanhas
//      await apiRequest(`/admin/campanhas`, campanha);
//
//      GET - Encontrar campanha específica
//      await apiRequest(`/admin/campanhas/${id}`, campanha);
//
//      POST - Criar nova campanha 
//      await apiRequest("/admin/campanhas", "POST", campanha);
//
//      PUT - Atualizar campanha
//      await apiRequest(`/admin/campanhas/${id}`, "PUT", campanha);
//
//      DELETE - Remover campanha
//      await apiRequest(`/admin/campanhas/${id}`, "DELETE", campanha);