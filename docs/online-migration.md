# CURIÓ online — implementação em etapas

## Estado atual

O app 2.7.8 é uma PWA estática no GitHub Pages. `index.html` abre o IndexedDB
`FigureCollection25` (versão 1) e usa as stores `figures`, `wishlist`, `groups`
e `settings`. As fotos são Data URLs dentro dos registros; os snapshots ficam
no `localStorage`. Nenhuma alteração neste documento ou na migração SQL muda
esses dados locais.

## Primeira entrega

`supabase/migrations/20260926000000_online_foundation.sql` cria as tabelas,
as políticas por usuário e o bucket privado `figure-photos`. O site atual
continua funcionando localmente até existir um fluxo de conta e importação
validado. Não publicar chaves de serviço no navegador; apenas a URL do projeto
e a chave publicável podem aparecer no cliente, sempre com RLS ativo.

## Piloto validado em 26/09/2026

- A migração SQL foi executada no projeto Supabase de testes.
- O teste de RLS passou para duas contas nas seis tabelas. O teste da API do
  Storage permitiu uploads e leituras próprios e bloqueou leitura cruzada,
  links assinados cruzados, upload na pasta alheia e acesso público.
- O piloto de login exibiu registros da mesma conta no PC e no celular.
- O backup JSON atual foi importado: **62 figuras, 10 coleções, 0 desejos e
  100 fotos**. O importador comparou cada foto baixada com os bytes do arquivo.
  O usuário confirmou que os dados aparecem no celular após login na mesma
  conta. Esses números substituem o registro anterior de 61 figuras e 7 coleções.
- `online-pilot.html`, `import-pilot.html`, `storage-test.html` e
  `export-online.html` são ferramentas isoladas de teste. A PWA publicada
  continua usando IndexedDB e não foi convertida para a fonte remota.
- A exportação completa da conta online foi executada. O usuário importou o
  JSON resultante em uma segunda conta de teste e confirmou que os dados
  aparecem nela. Exportação e restauração foram validadas no piloto.
  Não eliminar o JSON original nem os dados locais até a interface completa
  usar a fonte remota e passar por nova validação.
- `index-online.html` e `online-data.js` são a primeira conexão da interface
  completa à conta remota. Mostram Início, Coleção, Wishlist e Financeiro com
  figuras, vínculos de coleções e fotos privadas. A aba Mais mantém tema e
  privacidade, gravados por conta. As metas foram movidas para Financeiro →
  Editar metas e também são gravadas por conta. Cadastro, edição e exclusão
  de figuras, backup local e recuperação ficam inacessíveis nessa página até
  existir uma camada de gravação remota segura para essas operações.
  A aparência e a navegação ainda precisam de validação no PC e no celular.

| Origem local | Destino remoto | Regra de importação |
| --- | --- | --- |
| `figures` | `figures` | `id` local vira `legacy_id`; `name` fica indexável; demais metadados vão em `data`, sem imagens nem `groups` |
| `groups` | `collections` | `id` local vira `legacy_id`; vincular às figuras por nome, verificando ambiguidades |
| `figures[].groups` | `figure_collections` | resolver o nome para um ID da coleção do mesmo usuário |
| `wishlist` | `wishlist` | `id` local vira `legacy_id`; demais campos em `data` |
| `settings` | `user_settings` | conservar preferências; revisar campos de backup local antes de sincronizar |
| `cover`, `coverOriginal`, `gallery[]` | bucket + `figure_photos` | converter Data URL em Blob e enviar para `<owner_id>/<figure_id>/<tipo>-<posição>.<ext>`; registrar caminho apenas após upload confirmado |
| `coverCrop` | `figures.data` | preservar parâmetros do enquadramento |
| snapshots locais | sem importação automática | conservar no aparelho e exportar JSON separadamente |

`legacy_id` é único por usuário em cada tipo de registro: a importação pode
ser retomada sem duplicar figuras. Para novos registros, `legacy_id` é nulo.
Os dados JSON não devem conter `cover`, `coverOriginal` ou `gallery`, pois isso
recriaria a dependência de Base64 no banco. Validar os campos aceitos no cliente
antes de gravar e impedir que o cliente remoto traga HTML arbitrário para a UI.

## Ordem para construir o piloto

1. Exportar o backup JSON **no aparelho que contém a coleção**, conferir o
   arquivo e guardar uma segunda cópia fora do navegador. Preservar IndexedDB.
2. Criar projeto Supabase de testes e aplicar a migração SQL. Configurar URLs
   de redirecionamento da autenticação para o endereço HTTPS do piloto, e
   configurar e-mail transacional antes de abrir cadastros ao público.
3. Testar com duas contas: cada uma só lê, altera e apaga seus registros e
   arquivos; caminhos de foto de outra conta devem falhar. Testar também
   referências cruzadas em `figure_collections` e `figure_photos`.
4. Adicionar interface de login e uma camada de acesso aos dados. Enquanto o
   piloto estiver isolado, manter a versão 2.7.8 publicada sem troca de fonte
   dos dados. No primeiro ciclo online, exigir conexão para escrita.
5. Implementar importação com progresso por lote, retomada após erro e
   conferência de contagens e imagens. Uma figura só é considerada completa
   quando seus metadados e fotos foram verificados. Proteger contra dois
   aparelhos tentando importar bases locais diferentes para a mesma conta.
6. Abrir a coleção em outro dispositivo, testar criar/editar/excluir e conferir
   que a mudança aparece no primeiro após recarregar. Só então oferecer a
   passagem da fonte principal de dados para o servidor.
7. Implementar exportação recuperável dos metadados **e** das fotos. Backup
   do banco não contém os arquivos de Storage. Manter o JSON local original
   até esse fluxo estar validado; nunca apagar a base local automaticamente.

## Decisões de compatibilidade

- GitHub Pages pode continuar hospedando o HTML. O service worker pode guardar
  a interface em cache, mas respostas privadas não devem virar cache público.
- Fotos privadas precisam de URL assinada temporária ou download autenticado;
  o caminho armazenado no banco não é uma URL pública permanente.
- Edição concorrente, conflitos entre aparelhos e uso sem internet exigem um
  protocolo próprio. No piloto, ler dados do servidor ao abrir e bloquear
  gravações offline; não sobrescrever silenciosamente uma edição mais recente.
- Excluir metadados não remove automaticamente o arquivo do bucket. O fluxo de
  exclusão deve remover fotos associadas com confirmação e tratar falhas.
- Plano gratuito serve para piloto, sujeito aos limites e à pausa por inatividade.
  Antes da abertura pública, revisar capacidade, custo, e-mail e rotinas de
  backup dos objetos de Storage.

## Critério para ativar contas na versão publicada

Uma conta nova acessa somente seus dados; a coleção local de teste migra com
imagens e sem duplicação depois de uma interrupção simulada; exportação é
restaurável; o segundo aparelho mostra a mesma coleção; a versão local 2.7.8
continua recuperável pelo JSON e pelos checkpoints de código.
