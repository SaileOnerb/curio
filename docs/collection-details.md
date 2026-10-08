# Coleções personalizadas

Aplicar no SQL Editor do Supabase a migração supabase/migrations/20261004000000_collection_details.sql. Ela adiciona apenas o campo data à tabela collections; as permissões por conta permanecem existentes.

Nome, fabricante, destaque e referência da capa são salvos por coleção. A imagem reduzida a até 1000 px é enviada ao bucket privado figure-photos, sob o prefixo do usuário. As capas são carregadas sob demanda, sem baixar todas antes do login.

Home mostra somente coleções marcadas como destacadas. Gerenciar coleções permite editar e destacar registros existentes. Fabricante é descritivo, não move nem muda o fabricante das figuras. Renomear continua sendo uma ação separada para preservar vínculos.

O exportador inclui a imagem da capa no backup; importação preserva fabricante e destaque e envia a imagem para o Storage da conta de destino. A remoção de coleção e o Nulificador incluem limpeza dessas capas.

Validação em dispositivo e no Supabase após aplicar a migração ainda pendente.
