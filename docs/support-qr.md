# QR Code Pix do apoio

O CURIÓ mostra a imagem original em `Configurações > Apoie o CURIÓ > Ver Pix`.
O arquivo fica no Supabase Storage e só administradores do projeto podem enviá-lo.

1. No Supabase, abra **SQL Editor** e execute a migração
   `supabase/migrations/20260929000000_support_qr_asset.sql` se ela ainda
   não tiver sido aplicada. Ela cria o bucket `curio-assets`, público para
   leitura e sem política de envio para usuários do aplicativo.
2. Em **Storage > curio-assets**, crie a pasta `support` e envie o arquivo
   original do banco como **`pix.png`**. Use PNG sem redimensionar, aplicar
   filtros ou converter para JPEG. Tamanho máximo: 2 MiB.
3. Abra a URL
   `https://xyuqdpenhnlwnplisxjh.supabase.co/storage/v1/object/public/curio-assets/support/pix.png`
   e confira se mostra o QR original. Depois teste a leitura no app de um
   banco e confira o nome do recebedor **antes de confirmar qualquer Pix**.
4. Para trocar a imagem, substitua o mesmo arquivo no painel do Supabase.
   O CURIÓ consulta a versão mais recente quando a janela de apoio abre.

O painel de administração do Supabase é privado; o próprio QR tem URL pública
para poder ser lido no navegador. Ninguém obtém permissão para enviar arquivos
ao bucket por estar logado no CURIÓ.
