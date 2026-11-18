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
- **Variável de ambiente obrigatória:** `CRM_WEBHOOK_URL` com a URL do webhook de leads do CRM Fonil (`https://crm.fonilgroup.com.br/api/webhooks/leads/<token>`). Sem ela, o formulário recusa os cadastros.
- Bind: `0.0.0.0` por padrão

O arquivo `nixpacks.toml` fixa Node 22 e os comandos acima. Também é possível publicar somente o conteúdo de `dist/` em uma hospedagem estática após o build.

## Estrutura

- `public/`: arquivos de origem da página, imagens e fontes locais.
- `scripts/build.mjs`: verifica os arquivos referenciados e prepara `dist/`.
- `server.mjs`: servidor HTTP sem dependências externas.
- `dist/`: saída gerada e ignorada pelo Git.

As fotografias JPG originais ficam preservadas em `public/assets/`. A página usa os seis arquivos `*-transparent.png` com transparência, sem mistura de cores com o fundo. As instruções de geração estão em `IMAGE-EDITS.md`.

## Formulário

O formulário envia os dados para `POST /api/lead` no próprio `server.mjs`. O servidor valida os campos e repassa ao CRM Fonil pela URL em `CRM_WEBHOOK_URL`. O token não aparece no navegador nem no repositório, que é público. Localmente, a variável pode ficar em `.env`, que o Git ignora (modelo em `.env.example`).

Campos enviados ao CRM: `name` (nome + supermercado, porque o CRM não tem campo de empresa), `phone`, `document`/`cnpj`, `city`, `state` e `company`. A tela de sucesso aparece só quando o CRM responde HTTP 2xx. As falhas ficam registradas no log do servidor.

## Créditos

Copy e direção visual fornecidas pelo usuário. Fotos obtidas no catálogo oficial https://www.chikas.com.br, com versões de fundo transparente editadas via ImageGen. Fontes Barlow Condensed e DM Sans hospedadas localmente. Assinatura tipográfica e símbolo floral recriados a partir da referência visual.
