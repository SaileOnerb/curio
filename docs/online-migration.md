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
- `index-online.html` e `online-data.js` conectam a interface completa à conta
  remota. A tela de login usa o ícone, a paleta e a tipografia do CURIÓ; guarda
  apenas a chave publicável no navegador, nunca a senha. A interface lê e
  grava figuras, fotos, coleções, vínculos, wishlist, preferências e metas.
  Cadastro, edição, favoritos, conversão da wishlist e exclusão individual ou
  em lote usam a conta autenticada. Fotos são enviadas ao bucket privado e
  metadados são gravados em `figure_photos`. O botão Atualizar consulta o
  servidor para trazer mudanças de outro dispositivo. Configurações oferece
  exportação JSON completa e o Nulificador Total online com backup e duas
  etapas de confirmação. O usuário validou o Nulificador em uma conta de
  teste. A interface completa com gravação ainda precisa de teste manual no
  PC e no celular antes de substituir a PWA publicada.

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

## Nulificador Total da conta online (piloto)

A interface `index-online.html` mostra a ação em Configurações após o login.
Ela gera um backup JSON completo da conta, exige que a pessoa confira o download,
abre uma segunda etapa e pede a palavra `APAGAR`. A limpeza é limitada pelo
`owner_id` e pelas políticas RLS da conta atual. Exclui objetos do bucket privado,
vínculos, metadados de fotos, figuras, coleções, wishlist e preferências. Não exclui
a identidade do Supabase Auth nem dados offline do navegador. Se a operação falhar,
mostra o erro e permite repetir com o backup guardado; objetos são apagados antes
dos registros de fotos para preservar caminhos de recuperação. A exclusão real não
foi executada sobre a coleção do usuário nesta validação.

## Validação do piloto com gravação

Executar em uma conta de teste: criar coleção; cadastrar figura com capa e
galeria; editar nome, preço, foto e coleções; adicionar e editar wishlist;
converter item em figura; excluir e desfazer; atualizar no segundo dispositivo
e comparar. Gerar backup JSON antes de limpar a conta. O teste automatizado
com respostas simuladas cobre criação, edição, vínculo, foto, wishlist e
exclusões. Não houve escrita automatizada na coleção real do usuário.

As operações de banco e Storage são chamadas separadas: uma falha no meio
pode deixar metadados ou arquivos parcialmente atualizados. O piloto mostra
erro e permite atualizar para ler o estado confirmado pelo servidor. Edições
de figuras e wishlist verificam `updated_at` para evitar sobrescrever uma
alteração mais recente sem aviso. Ainda falta um fluxo completo de resolução
de conflitos e recuperação de arquivos órfãos para a versão definitiva.

## Importação pela interface online

Configurações → Dados da conta → Importar JSON abre uma janela com prévia do
`curio-backup` v1, quantidades, tamanho aproximado das fotos e identificador
SHA-256. A importação é permitida em conta vazia ou para retomar exatamente o
mesmo arquivo já iniciado nessa conta. Outra coleção presente bloqueia a
operação para impedir uma mescla acidental. O arquivo local não é modificado.
Coleções e figuras usam `legacy_id` para retomada; fotos são baixadas após o
envio e comparadas por tamanho e SHA-256. A conclusão verifica contagens de
figuras, coleções, wishlist, fotos e vínculos, e aplica preferências do arquivo
somente na primeira conclusão. Erros mantêm o arquivo selecionado para nova
tentativa. O teste com servidor simulado cobriu importação, retomada sem
duplicação e bloqueio de arquivo diferente. Ainda é necessária validação real
no PC e no celular com uma conta de teste.
