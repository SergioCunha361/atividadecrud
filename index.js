// Importando com (commomjs);

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORTA;
const app = express();


//aplicação use express como json(javascript)
// é um middleware que automaticamente converte o corpo de requisição em formato JSON
//  para um objeto JavaScript em req.body.
app.use(express.json());

const bancoDados = [];

//mostrar TODOS os pedidos do banco de dados

app.get('/pedidos', (requisicao, resposta) => {
  try {
    if (bancoDados.length === 0){
       return resposta.status(200).json({mensagem:"Banco de dados vazio"})
    }  
    
    resposta.status(200).json(bancoDados);
  } catch (error) {
  resposta.status(500).json({mensagem:"Erro ao buscar pedido",erro:error.mensagem})
  }
});

//mostrar um ÚNICO pedido selecionado pelo id

app.get("/pedidos/:id", (requisicao, resposta) => {
  try {
    const id = requisicao.params.id;  // esse id é string naturalmente
    const pedido =bancoDados.find( elemento => elemento.id === id);
    if (!pedido){
      return resposta.status(404).json({mensagem:"Pedido não encontrado"})
    }
  resposta.status(200).json(pedido)    
  } catch (error) {
    resposta.status(500).json({mensagem: "Erro ao buscar pedido",erro: error.message})    
  }
})

//Cadastrar um pedido

app.post('/pedidos', (requisicao, resposta) => {
  try {
  const { id, cliente,  medicamento, quant_medicamento,  vl_total, status_pedido, forma_pagamento } = requisicao.body;
  if (!id || !cliente || !medicamento || !quant_medicamento || !vl_total || !status_pedido || !forma_pagamento) {
    return resposta.status(200).json({mensagem:"Todos os dados devem ser preenchidos"});
  }
 
  const novoPedido = { id, cliente,  medicamento, quant_medicamento,  vl_total, status_pedido, forma_pagamento };
  bancoDados.push(novoPedido);
  resposta.status(201).json({ mensagem: "pedido feito"});// não tem return porque não tem IF
    } catch (error){

    }
});

//Alterar algum campo do pedido

app.put('/pedidos/:id', (requisicao, resposta) => {
  try {
    // loacalhost:3000/produtos/1 - O 1 é o parametro
const id  = requisicao.params.id;

const pedido = bancoDados.find(elemento => elemento.id === id);
if (!id){
  return resposta.status(404).json({mensagem:"Informe o parametro"})
}
if (!pedido){
  return resposta.status(404).json({mensagem: "Pedido não enconatrado"})
}
  const { novoCliente,  novoMedicamento, novoQuant_medicamento,  novoVl_total, novoStatus_pedido, novoForma_pagamento }= requisicao.body;
  if (pedido){

    pedido.cliente = novoCliente 
    pedido.medicamento = novoMedicamento
    pedido.quant_medicamento = novoQuant_medicamento
    pedido.vl_total = novoVl_total
    pedido.status = novoStatus_pedido
    pedido.forma_pagamento = novoForma_pagamento

    return resposta.status(200).json({mensagem: "Pedido atualizado com sucesso"})
    }
    

    } catch (error){
      resposta.status(500).json({mensagem:"Erro ao editar pedido",erro: error.message})
  }
})

//Deletear um ÚNICO pedido

app.delete('/pedidos/:id', (requisicao, resposta) => {
  try {
    // loacalhost:3000/produtos/1 - a resposta é -1 quando não encontrado e 
    // quando encontrado é a posição no array 
    const  id  = requisicao.params.id;
  
    const index = bancoDados.findIndex(elemento => elemento.id === id)
    if (index === -1){
      return resposta.status(404).json({mensagem: "Pedido não encontrado"})
    }
    bancoDados.splice(index,1)
    resposta.status(200).json({mensagem:"Pedido deletado com sucesso"})

  } catch (error){
    resposta.status(500).json({mensagem:"Erro ao excluir pedido",erro: error.message})
  }
});

//Deletar TODOS os pedidos

app.delete("/pedidos", (requisicao, resposta) => {
  try {
    bancoDados.length = 0; // ou bancoDados = []
    resposta.status(200).json({mensagem:"Todos os pedidos foram deletados"})
  } catch (error) {
    resposta.status(500).json({mensagem:"Erro ao deletar pedidos",erro: error.message})  
  }
})

//Carregar o sistema na porta definida na variável PORTA no arquivo .env

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});