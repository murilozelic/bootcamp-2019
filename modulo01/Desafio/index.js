const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let contagemRequisicoes = 0;

// Crie um middleware global chamado em todas requisições que imprime (console.log) 
// uma contagem de quantas requisições foram feitas na aplicação até então;
server.use((req, res, next) => {

  console.log(`Método ${req.method}; Contagem: ${contagemRequisicoes += 1}`);

  return next();

})

// Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto
// nos parâmetros da URL que verifica se o projeto com aquele ID existe. Se não 
// existir retorne um erro, caso contrário permita a requisição continuar 
// normalmente;
function checkProjectId(req, res, next) {
  const { id } = req.params;

  if (!projects[id]) {
    return res.status(400).json({ error: 'Project does not exists!' })
  }

  return next();
}

// POST /projects
// A rota deve receber id e title dentro corpo de cadastrar um novo projeto dentro 
// de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; 
// Certifique-se de enviar tanto o ID quanto o título do projeto no formato string 
// com àspas duplas.
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const tasks = [];

  projects[id] = { id, title, tasks };
  return res.json(projects);
});

// GET /projects
// Rota que lista todos projetos e suas tarefas;
server.get('/projects', (req, res) => {
  return res.json(projects);
})

// PUT /projects/:id
// A rota deve alterar apenas o título do 
// projeto com o id presente nos parâmetros da rota;
server.put('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].title = title;
  res.json(projects);
});

// DELETE /projects/:id
// A rota deve deletar o projeto com o id presente nos 
// parâmetros da rota;
server.delete('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  res.json(projects);
});

// POST /projects/:id/tasks
// A rota deve receber um campo title e armazenar uma 
// nova tarefa no array de tarefas de um projeto específico escolhido através do 
// id presente nos parâmetros da rota;
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  res.json(projects);
})

server.listen(3000);