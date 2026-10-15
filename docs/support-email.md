# Suporte por e-mail

Destino fixo: support@curiocollection.com.br → curiocollection26@gmail.com.
Endpoint: https://curiocollection.com.br/api/support/inbound

## Resend e Netlify
1. Resend > API Keys: criar chave exclusiva para o encaminhamento com Full access (leitura dos recebidos e envio). Não reutilizar a chave SMTP do Supabase. Guardar no Netlify Production, variável secreta RESEND_SUPPORT_API_KEY.
2. Resend > Webhooks > Add webhook: URL acima, evento email.received. Copiar signing secret para variável secreta RESEND_SUPPORT_WEBHOOK_SECRET no Netlify Production.
3. Publicar a função depois de salvar as variáveis. Testar com mensagem real ao suporte e conferir entrega no Gmail, inclusive Spam. Não enviar chave ou segredo pelo chat.
4. A função verifica assinatura Svix, recupera o conteúdo e filtra destinatário exato, incluindo BCC. Encaminha somente ao Gmail fixo. Reply-To usa o endereço de resposta original ou remetente. Nunca responde automaticamente ao usuário.
5. Encaminha texto e anexos até 20 MiB no total. Mensagens só HTML geram um aviso para consultar o original no Resend; não renderiza HTML arbitrário. Falhas retornam 503 para permitir retentativas. Monitorar eventos falhos no Resend; arquivos maiores precisam de atendimento no painel, não são descartados silenciosamente. Idempotência do Resend cobre 24 horas; replays manuais posteriores podem reenviar.

## Responder pelo Gmail como suporte (solução temporária)
A documentação do Gmail anuncia o fim de “Enviar como” para endereços de terceiros em janeiro de 2027. Planejar migração para caixa de correio própria ou interface de resposta por API. O encaminhamento não depende desse recurso.

No Gmail curiocollection26@gmail.com, pelo computador:
Configurações > Ver todas as configurações > Contas e importação > Enviar e-mail como > Adicionar outro endereço.
Nome: CURIÓ Suporte. Endereço: support@curiocollection.com.br. Tratar como alias: sim.
SMTP: smtp.resend.com, porta 465, SSL. Usuário: resend. Senha: chave Resend exclusiva de envio, restrita ao domínio curiocollection.com.br. Nunca usar a chave Full access do encaminhamento no Gmail.
O código/link de confirmação chega ao suporte; consultar Receiving no Resend ou a cópia encaminhada. Definir suporte como remetente padrão e Reply-To support@curiocollection.com.br. Conferir campo De em cada resposta (encaminhamento pode fazer o Gmail selecionar o endereço Gmail).
Testar resposta para uma caixa externa e confirmar remetente, destino e chegada da resposta seguinte ao suporte. Não declarar envio funcionando antes desse teste.

Fontes: https://resend.com/changelog/smtp-service ; https://support.google.com/mail/answer/22370?hl=pt-BR ; https://github.com/resend/resend-skills/blob/main/skills/resend/references/receiving.md
