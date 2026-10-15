# Idiomas — 4.2.0 em preparação

Português brasileiro e inglês. O primeiro acesso usa navigator.language; a escolha explícita fica no dispositivo e, após entrar, na conta via user_settings.data.language. Uma preferência já salva na conta prevalece após carregar os registros. Falha de salvamento restaura o idioma anterior.

platform-i18n.js é compartilhado pelo site e build Android. Traduz apenas frases do catálogo; campos editáveis, nomes de figuras/coleções e fabricantes são preservados. Moeda permanece BRL: idioma não converte valores financeiros.

Catálogo inicial cobre navegação, ações, filtros, coleções, Wishlist e parte de autenticação/configurações. Frases sem entrada permanecem em português. Ainda falta completar mensagens dinâmicas de importação/exportação, diagnóstico, finanças e erros de serviço; e testar layouts com inglês em dispositivo. E-mails do Supabase não são traduzidos por essa camada.

Controles nativos de arquivos e permissões seguem o idioma do sistema.
