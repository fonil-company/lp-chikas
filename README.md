# Chikas — revenda para supermercados

Landing page responsiva com a identidade visual Chikas, fotos dos seis produtos em PNG transparente e formulário para solicitação do catálogo.

## Execução local

Use Node 22 e npm 10 ou superior:

```sh
npm ci
npm run build
npm start
```

Abra http://localhost:3000. Para desenvolvimento, `npm run dev` prepara os arquivos e inicia o servidor. Reinicie o comando após editar os arquivos de origem.

## EasyPanel / Nixpacks

- Repositório: `https://github.com/fonil-company/lp-chikas.git`
- Branch: `main`
- Diretório de build: raiz do repositório
- Instalação: `npm ci`
- Build: `npm run build`
- Início: `npm start`
- Porta interna: `3000` (ou o valor da variável `PORT`)
- Bind: `0.0.0.0` por padrão

O arquivo `nixpacks.toml` fixa Node 22 e os comandos acima. Também é possível publicar somente o conteúdo de `dist/` em uma hospedagem estática após o build.

## Estrutura

- `public/`: arquivos de origem da página, imagens e fontes locais.
- `scripts/build.mjs`: verifica os arquivos referenciados e prepara `dist/`.
- `server.mjs`: servidor HTTP sem dependências externas.
- `dist/`: saída gerada e ignorada pelo Git.

As fotografias JPG originais ficam preservadas em `public/assets/`. A página usa os seis arquivos `*-transparent.png` com transparência, sem mistura de cores com o fundo. As instruções de geração estão em `IMAGE-EDITS.md`.

## Formulário

A integração com o CRM foi adiada a pedido do usuário. Enquanto `leadEndpoint` estiver vazio em `public/config.js`, nenhum dado é enviado ou armazenado. Após a validação dos campos, a página informa que o formulário estará disponível em breve.

Para conectar o recebimento, configure um endpoint público que aceite POST JSON com `name`, `supermarket`, `whatsapp` (DDD e número), `city`, `state` e `cnpj`. A confirmação de cadastro aparece apenas após resposta HTTP 2xx. Tokens e segredos devem ficar no servidor. Configure o CORS da origem e teste o recebimento antes de ativar a campanha.

## Créditos

Copy e direção visual fornecidas pelo usuário. Fotos obtidas no catálogo oficial https://www.chikas.com.br, com versões de fundo transparente editadas via ImageGen. Fontes Barlow Condensed e DM Sans hospedadas localmente. Assinatura tipográfica e símbolo floral recriados a partir da referência visual.
