# Portfólio — Hapolo11

Site de portfólio estático (HTML/CSS/JS puro, sem build). Busca os repositórios
públicos do GitHub em tempo real via API e exibe os mais relevantes.

## Estrutura

- `index.html` — estrutura da página
- `style.css` — tema visual
- `script.js` — busca dados do GitHub (`api.github.com`) e monta os cards de projeto e skills

## Rodar localmente

Basta abrir `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
npx serve .
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex: `Hapolo11/portfolio` ou `Hapolo11/Hapolo11.github.io` para usar o domínio raiz).
2. `git remote add origin <url-do-repo>` e `git push -u origin main`.
3. Nas configurações do repositório: **Settings → Pages → Source: branch `main`, pasta `/ (root)`**.
4. O site fica disponível em `https://hapolo11.github.io/<nome-do-repo>/`.

## Personalizar

- Projeto em destaque: editado diretamente no `index.html` (seção `#projetos` → `.featured-card`).
- Bio/tagline: se o perfil do GitHub tiver uma bio preenchida, ela substitui o texto padrão automaticamente (`script.js`).
- Repositórios ocultos da grade automática: array `EXCLUDE_REPOS` em `script.js`.
