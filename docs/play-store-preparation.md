# Preparação Google Play

Estado: preparação local; não publicado nem enviado para revisão da loja.

## Preparado
- Página pública account-deletion.html com solicitação por e-mail; link em Configurações. Exclusão pelo próprio usuário exige sessão válida, senha atual e frase EXCLUIR CONTA. O servidor remove Storage e depois Auth, com cascata do banco. Atendimento humano continua como alternativa para perda de acesso. Exclusão real validada pelo responsável em conta descartável em 15/10/2026.
- Backup automático Android desativado para evitar cópia de sessão pelo sistema; exportação explícita do usuário preservada.
- Assinatura release por variáveis de ambiente; a compilação release falha se faltarem credenciais.
- Workflow manual Android release gera AAB assinado. Não publica automaticamente na loja.
- Política versão 1.0 em privacy.html, com links na tela de acesso e Configurações; notas de revisão em privacy-policy-draft.md.

## Pendências antes de submissão
1. Criar/verificar a conta Play Console e confirmar nome público do desenvolvedor.
2. Política versão 1.0 concluída; conferir retenção dos provedores e preencher Data safety. Publicar página de exclusão e testar atendimento completo em conta descartável, incluindo Storage, banco, perfil e Supabase Auth. Não excluir contas reais para teste.
3. Criar chave de upload em computador confiável; guardar cópias protegidas e senhas. Não enviar pelo chat nem commitar chaves.
4. No GitHub, criar environment android-release, preferencialmente com revisão obrigatória; configurar secrets CURIO_KEYSTORE_BASE64, CURIO_KEYSTORE_PASSWORD, CURIO_KEY_ALIAS, CURIO_KEY_PASSWORD. O primeiro secret é o arquivo JKS codificado em base64, que continua sendo secreto.
5. Executar Actions > Android release > Run workflow na branch feat/online-foundation. Baixar o artefato curio-play-bundle (AAB).
6. Criar teste interno no Play Console e configurar Play App Signing; enviar AAB. Incrementar versionCode em cada envio posterior.
7. Preparar ficha, ícone, screenshots reais, classificação etária, público, credenciais para revisão e formulário de dados. Verificar também regras de Pix e afiliados antes de disponibilizar essas funções na loja.
8. Testar login/recuperação, fotos, links, backup/restauração, exclusão, navegação e performance em aparelho real. Para contas pessoais novas, verificar requisitos atuais de teste fechado antes de solicitar produção.

## Assinatura e migração
O APK debug atual tem assinatura diferente da distribuição Play. A primeira migração pode exigir desinstalação; antes disso, confirmar sincronização e exportar backup. Depois, manter applicationId br.com.curiocollection.app e a identidade de assinatura da distribuição para atualizações.

## Compilar release localmente
Com JDK 21, Android SDK e projeto atualizado, configure CURIO_KEYSTORE_PATH (caminho absoluto do JKS) e as três variáveis de senha/alias acima. Execute npm ci, npm run android:sync e, na pasta android, .\gradlew.bat bundleRelease. Resultado: android/app/build/outputs/bundle/release/app-release.aab.

Fontes: https://support.google.com/googleplay/android-developer/answer/13327111 ; https://support.google.com/googleplay/android-developer/answer/10144311 ; https://developer.android.com/studio/publish/app-signing
