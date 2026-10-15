# Validação privada do Mercado Livre

Esta etapa verifica acesso real à API antes de integrar a Wishlist ou estimar valores.
Não modifica anúncios. Não persiste access/refresh tokens; o usuário autoriza novamente a cada teste.
Não demonstra acesso a histórico de vendas concluídas. Um 403 pode indicar permissão ou bloqueio da origem; um anúncio removido pode retornar 404.

## Configuração no Netlify

Em variáveis de ambiente, adicione para o contexto de produção e escopo Functions:

- `MELI_CLIENT_ID`: ID do aplicativo no Mercado Livre.
- `MELI_CLIENT_SECRET`: chave secreta, somente no servidor.
- `MELI_VALIDATION_PASSWORD`: senha longa e exclusiva para o painel privado. Usuário: `admin`.
- `MELI_OAUTH_COOKIE_KEY`: 32 bytes aleatórios, codificados em 64 caracteres hexadecimais. Gere localmente com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.

Não salve os valores no Git, no APK ou em screenshots. O painel usa HTTPS e autenticação Basic.

No Mercado Livre: Authorization Code e PKCE habilitados, Publicação e sincronização em Leitura.
Redirect URI exata: `https://curiocollection.com.br/api/mercadolivre/callback`.

Depois que as funções forem publicadas, abra `https://curiocollection.com.br/api/mercadolivre`, autentique como admin e clique Autorizar e testar.
A configuração de ambiente requer um novo deploy para entrar em vigor. O painel retorna 503 enquanto faltarem variáveis.

## Proteções e limites

State aleatório e PKCE S256; sessão de dez minutos em cookie HttpOnly/Secure/SameSite=Lax, cifrada AES-256-GCM.
Callback valida state e descarta cookie. Código de autorização é de uso único no provedor.
Não registra código, credenciais, dados de conta ou tokens em logs. Resultados exibem somente status das consultas.
Endpoints consultados: users/me, sites/MLB/search, um anúncio externo conhecido e products/search.
O resultado ainda precisa ser avaliado antes de anunciar suporte. Tokens permanentes, renovação e acesso público à Wishlist estão fora desta etapa.
Teste administrativo pelo navegador web; nenhuma alteração no cliente web/Android é necessária nesta fase.
