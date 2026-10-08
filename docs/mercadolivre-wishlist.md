# Mercado Livre na Wishlist — 4.4.0

Links completos de catálogo `/p/MLB...` usam o ID exato para consultar nome e foto.
Preço permanece manual: a API de catálogo testada não forneceu preço.
Links sem ID de catálogo e outras lojas continuam no fluxo existente, com preenchimento manual quando indisponível.
A autorização administrativa compartilhada só acessa produtos públicos de catálogo. Usuários do CURIÓ não recebem tokens nem dados da conta Mercado Livre.

## Ativação

1. Execute `supabase/migrations/20261008000000_marketplace_connection.sql` no SQL Editor.
2. No Supabase, API Keys, crie/copie uma chave secreta `sb_secret_...` exclusiva para o servidor.
3. No Netlify, configure `SUPABASE_SECRET_KEY`, marcada secreta, somente Production. Nunca use no cliente web/APK.
4. Publique as funções e interface pendentes pelo GitHub.
5. Abra `/api/mercadolivre`, marque "Salvar conexão para a Wishlist do CURIÓ" e autorize novamente. Confirme "Conexão salva para a Wishlist".
6. Na Wishlist cole o link de catálogo, clique Analisar link, revise nome/foto/edição, informe o preço manualmente e adicione.

## Proteções

Tabela sem permissões para anon/authenticated, RLS habilitado, tokens cifrados AES-256-GCM com chave derivada da MELI_OAUTH_COOKIE_KEY. Uma lease no banco serializa o uso do refresh token de uso único entre instâncias. Falhas não exibem tokens nem respostas privadas. Revogação/400/401 na renovação remove a conexão e exige autorização nova.
Alterar a chave de cifra exige reconectar. Chaves de servidor não entram no Git, backup dos usuários ou APK.

## Android e publicação

Base compartilhada sincronizada com `npm run android:sync`. Endpoint de preview permite CORS somente nas origens nativas conhecidas. O novo APK ainda precisa ser compilado/instalado; sincronização não é um APK compilado.
Publicação 4.4.0 antecipada pelo responsável; contagem reiniciada em 0/3. Testes técnicos podem ser publicados sem aguardar o lote, conforme orientação do responsável em 07/10/2026.
