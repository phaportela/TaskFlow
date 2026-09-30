# TaskFlow

Aplicativo de tarefas feito para aprender como uma tela React conversa com uma API ASP.NET Core e um banco SQLite.

## Rodar no computador

Abra dois terminais na pasta do projeto.

No primeiro, inicie a API:

```powershell
cd TaskFlowApi.Api
dotnet run --urls http://localhost:5233
```

No segundo, inicie a tela:

```powershell
cd taskflow-web
npm install
npm run dev
```

O terminal do Vite mostra o endereço local da tela. A API cria o arquivo `taskflow.db` localmente quando inicia.

## Publicação de demonstração

O arquivo `render.yaml` configura uma publicação de demonstração no Render. No plano gratuito, o serviço pode dormir quando fica sem uso e o banco SQLite temporário pode ser apagado ao reiniciar ou publicar novamente.

A API não tem login. Use somente dados fictícios na versão pública.

## Publicar o frontend na Vercel

O frontend está em `taskflow-web` e pode ser publicado como um projeto Vite separado:

1. Crie um projeto na Vercel apontando para a pasta `taskflow-web`.
2. Use `npm run build` como comando de build e `dist` como diretório de saída.
3. Depois de publicar a API no Render, adicione a variável `VITE_API_URL` na Vercel com a URL do serviço, sem uma barra final.
4. Faça um novo deploy do frontend para que ele passe a chamar a API publicada.

Sem `VITE_API_URL`, o frontend usa `/api/Tasks`, que funciona apenas quando a API e o frontend estão no mesmo host ou quando o proxy local do Vite está ativo.