# Declaração de dados — CURIÓ

Preparada em 15/10/2026 para o pacote br.com.curiocollection.app, com base no código 4.5.0 e política 1.0 publicada na versão 4.5.1. Este guia não foi enviado à Google. Usar a versão efetivamente distribuída, não apenas o estado do site.

## Respostas gerais

| Pergunta | Resposta preparada | Evidência/limite |
|---|---|---|
| O app coleta dados? | Sim | Autenticação, fotos e registros são transmitidos ao Supabase. |
| Dados em trânsito são criptografados? | Sim para os fluxos próprios revisados | Supabase e funções Netlify usam HTTPS. Conferir tráfego da compilação final e SDKs antes de enviar. Não confundir com criptografia ponta a ponta. |
| Permite criar conta? | Sim: e-mail e senha | Supabase Auth. Não há cadastro social ou telefone no código atual. |
| Permite excluir conta? | Sim | Configurações → Nulificador Total → Excluir conta. Teste real concluído pelo responsável. |
| URL de exclusão | https://curiocollection.com.br/account-deletion.html | Já publicada. Inclui alternativa para quem perdeu acesso. |
| Exclui dados sem excluir conta? | Sim | Nulificador Total → Apagar dados da conta. Conferir o escopo exato se o formulário perguntar sobre dados de suporte/logs. |
| Política | https://curiocollection.com.br/privacy.html | Publicada com a versão 4.5.1; conferir disponibilidade antes de enviar a declaração. |
| Revisão independente de segurança | Não | Não houve auditoria MASA nem certificação equivalente. Não marcar selos. |

## Tipos de dados confirmados pelo código

Em cada linha abaixo, marcar coleta e informar que não é exclusivamente temporária: os dados permanecem na conta. As finalidades são propostas a partir das funções implementadas.

| Categoria/tipo na Play Console | Coleta | Finalidades aplicáveis | Como ocorre |
|---|---|---|---|
| Informações pessoais → E-mail | Obrigatória | Gerenciamento da conta; funcionalidade; comunicações do desenvolvedor (e-mails de acesso/recuperação) | Usado no cadastro/login e mensagens transacionais. Não há newsletter implementada. |
| Informações pessoais → IDs de usuário | Obrigatória | Gerenciamento da conta; funcionalidade | UUID Supabase vincula a coleção ao usuário. Não é ID de publicidade. |
| Informações pessoais → Nome | Opcional | Gerenciamento da conta; funcionalidade | Nome/apelido do perfil. A conta funciona sem preenchê-lo. |
| Fotos e vídeos → Fotos | Opcional | Funcionalidade | Fotos de figuras, capas e avatar; salvas para sincronização. |
| Informações financeiras → Histórico de compras | Opcional | Funcionalidade | Preço pago, data, loja e figuras adquiridas informados pelo usuário. |
| Informações financeiras → Outras informações financeiras | Opcional | Funcionalidade | Metas e estimativas financeiras da coleção. |
| Atividade no app → Outros conteúdos gerados pelo usuário | Obrigatória para a função principal de catalogar | Funcionalidade | Nomes das figuras, coleções, notas e demais conteúdo do catálogo. A ausência de notas não torna todo esse tipo opcional se os registros centrais são necessários à função principal. |
| Atividade no app → Outras ações | Opcional | Funcionalidade; personalização | Favoritos e escolha de figura/coleção de destaque sincronizados. |

Não marcar publicidade/marketing só por existir link de afiliado: avaliar os dados realmente transferidos e a finalidade do tratamento. Não marcar análises de uso sem evidência de coleta para essa finalidade.

## Compartilhamento: validação antes de selecionar a resposta global

O código não vende nem publica a coleção. Supabase hospeda dados; Netlify executa requisições; Resend envia e recebe mensagens; Gmail hospeda o atendimento. Essas transferências precisam constar na política. Na declaração, a exceção de prestador de serviço só vale quando ele processa em nosso nome, conforme instruções/contrato: verificar condições das contas antes de marcar “não compartilhado”.

Lojas e imagens externas exigem revisão separada. A análise envia o link à função e consulta a loja/API; o carregamento da imagem externa expõe dados técnicos da conexão ao servidor da imagem. A ação explícita de abrir uma loja externa pode ter tratamento diferente no formulário. Não usar a exceção de prestador de serviço automaticamente para Amazon, Mercado Livre ou outros destinos independentes.

## Itens que dependem da auditoria final, não de suposição

- Logs/IP/geolocalização: conferir Supabase e Netlify. IP recebido numa conexão não significa, por si só, uso de localização; verificar se os serviços inferem e armazenam cidade/país e para qual finalidade. Se houver isso no escopo do app, declarar localização aproximada. Verificar identificadores de navegador/dispositivo e diagnóstico coletados pelos provedores.
- Diagnóstico/crashes: não há SDK próprio de analytics ou crash reporting no código revisado. Isso não elimina a necessidade de avaliar os logs dos serviços e a compilação Android final.
- Busca: filtros locais não são histórico de buscas enviado ao servidor. Consultas de produto passam pelo servidor; revisar retenção de URL e logs antes de decidir se há histórico de pesquisa/navegação coletado.
- Importar/exportar: JSON é processado localmente e os registros resultantes são sincronizados. Não confundir isso com upload integral do documento. Nome/fingerprint da importação e anexos de suporte exigem avaliação própria.
- Suporte por e-mail: abrir o cliente de e-mail externo não dá acesso à caixa postal do usuário. Mensagens recebidas voluntariamente são tratadas no Resend/Gmail e estão na política; revisar se a implementação distribuída demanda declarar “E-mails” ou “Arquivos e documentos”. Não declarar que o app lê todo o Gmail.
- Pix/PayPal: exibir chave/endereço não coleta cartão ou senha bancária. Se depois integrarmos retorno de transações/identificação do doador, reavaliar a declaração.

## Sem coleta específica identificada no código atual

Não há função de GPS, contatos, calendário, SMS, chamadas, microfone, vídeo/áudio, apps instalados, documento/endereço/telefone de cadastro, score de crédito, conta bancária/cartão ou ID de anúncios. Isso se limita às funções revisadas; não substitui a conferência das dependências e dos provedores.

## Antes de enviar

1. Publicar privacy.html e verificar acesso sem login.
2. Comparar APK/AAB final, manifesto mesclado e dependências com este inventário.
3. Conferir contratos, logs, retenção e geolocalização dos provedores para fechar os pontos condicionais.
4. Confirmar a resposta de compartilhamento e preencher os detalhes por tipo. A declaração precisa ser consistente com a política e as versões ativas na loja.
5. Não marcar auditoria independente ou conformidade de famílias sem cumprir os requisitos específicos. Definir público-alvo na etapa própria.
6. Revisar a tela-resumo antes de enviar. Não há aprovação garantida por usar este guia.

Fonte oficial e definições: https://support.google.com/googleplay/android-developer/answer/10787469?hl=pt-BR
