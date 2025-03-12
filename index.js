// Importando com (commomjs);


// Importando banco de dados;
const { pool } = require ("./config/database");
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORTA;
const app = express();


//aplicação use express como json(javascript)
app.use(express.json());


//aplicação use express como json(javascript)
// é um middleware que automaticamente converte o corpo de requisição em formato JSON
//  para um objeto JavaScript em req.body.
app.use(express.json());



//mostrar TODOS os pedidos do banco de dados

app.get('/', async (requisicao, resposta) => {
  try {
  const consulta = `select * from pedido`
    const pedido = await pool.query(consulta)
    if (pedido.rows.length === 0) {
        return resposta.status(200).json({mensagem:"Banco de dados Vazio"})
    }
    return resposta.status(200).json(pedido.rows);
  } catch (error) {
  resposta.status(500).json({ mensagem:"Erro ao buscar pedido", erro:error.mensagem})
  }
});



//mostrar um ÚNICO pedido selecionado pelo id

app.get("/pedido/:id", async (requisicao, resposta) => {
  try {
    const id = requisicao.params.id;  // esse id é string naturalmente
    const dados1 = [id];
    const consulta1 = `select * from pedido where id = $1`;
    const resultado1 = await pool.query(consulta1, dados1);

    if (resultado1.rows.length === 0) {
      return resposta.status(404).json({ mensagem: "Pedido não encontrado" });      
    }
    resposta.status(200).json(resultado1.rows[0]);
   
  } catch (error) {resposta.status(500).json({mensagem: "Erro ao buscar produto", erro: error.message})    
  }
})
//Cadastrar um pedido


app.post('/pedido', async (requisicao, resposta) => {
  try {
  const { cliente, medicamentos, quantidade, valor_total, status, forma_pagamento } = requisicao.body;
  if (!cliente || !medicamentos|| !quantidade|| !valor_total|| !status|| !forma_pagamento) {
    return resposta.status(200).json({mensagem:"Todos os dados devem ser preenchidos"});
  }
  const dados = [ cliente, medicamentos, quantidade, valor_total, status, forma_pagamento ];//a funcao query necesita que os dados sejam passados em array
  const consulta = `insert into pedido (cliente, medicamentos, quantidade, valor_total, status, forma_pagamento)
  values ($1, $2, $3, $4, $5, $6) returning *`;
  // o returnig * é para retornar o produto criado
  await pool.query(consulta, dados); //necessita que os dados sejam passados em array
  //O banco de dados está sendo criado aqui no query
  // poderia ser assim:
  //await pool.query(insert into produto (nome, preco, quantidade) values ($1, $2, $3) returning *,[ nome, preco, quantidade ] );
  resposta.status(201).json({ mensagem: "Pedido criado com sucesso"});// não tem return porque não tem IF
    } catch (error){
        resposta.status(500).json({mensagem:"Erro ao fazer pedido",erro: error.message})
    }
});


//Alterar algum campo do pedido

app.put('/pedido/:id', async (requisicao, resposta) => {
  try {
    // loacalhost:3000/produtos/1 - O 1 é o parametro
const id  = requisicao.params.id;
const { novoCliente, novoMedicamentos, novoQuantidade, novoValor_total, novoStatus, novoForma_pagamento } = requisicao.body //levando dados para requisição

if (!id){
  return resposta.status(404).json({mensagem:"Informe o parametro"})
}
const dados1 = [id];// id em formato de array para a consulta
const consulta1 = `select * from produto where id = $1`
const resultado1 = await pool.query(consulta1, dados1)
//resutlado1 grava todos os elemtos que foram encontrados na consulta1
if (!resultado1.rows.length === 0){
  return resposta.status(404).json({mensagem: "Produto não enconatrado"})
  }
const dados2 =  [id, novoCliente, novoMedicamentos, novoQuantidade, novoValor_total, novoStatus, novoForma_pagamento ]
const consulta2 = `update produto set cliente = $2, medicamentos = $3, quantidade = $4, valor_total = $5, 
status = $6, forma_pagamento = $7 where id= $1 returning *`
await pool.query(consulta2, dados2)
resposta.status(200).json({mensagem: "Pedido atualizado com sucesso"})

} catch (error){
      resposta.status(500).json({mensagem:"Erro ao editar pedido",erro: error.message})
}
})



//Deletear um ÚNICO pedido

app.delete('/pedido/:id', async (requisicao, resposta) => {
  try {
    // loacalhost:3000/produtos/1 - O 1 é o parametro
    const  id  = requisicao.params.id;

const dados1 = [id];
const consulta1 = `select * from pedido where id = $1`
const resultado1 = await pool.query(consulta1, dados1)
 //resultado1 armazena linha pesquisada
if (!id){
  return resposta.status(404).json({mensagem:"Informe o parametro"}) 
}
if (!resultado1.rows.length === 0){
  return resposta.status(404).json({mensagem: "Produto não enconatrado"})
}
const dados2 = [id];
const consulta2 = `delete from pedido where id = $1`
await pool.query(consulta2, dados2)
resposta.status(200).json({mensagem:"Pedido deletado com sucesso"})

} catch (error){
    resposta.status(500).json({mensagem:"Erro ao excluir pedido",erro: error.message})
}
});

//Deletar TODOS os pedidos
app.delete("/pedido", async (requisicao, resposta) => {
  try {
    
    const consulta = `delete from pedido`;
    await pool.query(consulta);  
    resposta.status(200).json({mensagem: "Todos os pedidos foram dletados"})

  } catch (error) {
    resposta.status(500).json({mensagem:"Erro ao deletar pedidos", erro: error.message})  
  }
})


//Carregar o sistema na porta definida na variável PORTA no arquivo .env

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
