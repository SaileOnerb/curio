# Conversão monetária

Configurações > Moeda permite BRL, USD e EUR. Todos os registros, formulários, metas e backups permanecem em BRL. Valores exibidos usam a mesma função de conversão, incluindo coleção, detalhes, Wishlist e Financeiro. A conversão é indicativa, sem tarifas bancárias.

O endpoint /api/exchange-rates consulta Frankfurter v2 com base BRL e cotações USD/EUR. Cache de uma hora no servidor e no cliente; consulta ao voltar ao aplicativo e botão de atualização manual. A data exibida é a data de referência da fonte, que publica taxas diárias, não cotações em tempo real. Sem cotação válida, exibe BRL explicitamente; falha posterior mantém a referência anterior e informa a indisponibilidade. Não grava conversões no banco. Site e Android compartilham implementação; Android chama o endpoint HTTPS da produção.
