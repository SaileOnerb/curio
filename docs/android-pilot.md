# Piloto Android do CURIÓ

Projeto Capacitor 8. ID provisório: br.com.curiocollection.app.
A interface está empacotada; login e dados continuam no Supabase. Não é uma versão offline.

## Gerar no Windows

1. Instale Node.js 22 ou superior e Android Studio atualizado, de fontes oficiais.
2. No Android Studio, instale Android SDK Platform 36 e as ferramentas de build sugeridas pelo projeto. Use JDK 21 ou superior compatível com o Gradle do projeto.
3. Extraia o projeto. No terminal, dentro da pasta que contém package.json:

```powershell
npm ci
npm run android:sync
npm run android:open
```

4. Aguarde a sincronização Gradle no Android Studio. No menu Build, procure Generate App Bundles or APKs > Generate APKs (os nomes variam conforme a versão).
5. O APK de teste fica em android/app/build/outputs/apk/debug/app-debug.apk.
6. Transfira ao Android e permita a instalação por essa fonte quando solicitado.

Alternativa no terminal, após configurar JAVA_HOME e ANDROID_HOME:

```powershell
cd android
.\gradlew.bat assembleDebug
```

## Antes de distribuir

Esta base foi compilada no Windows e executada em dispositivo Android pelo responsável. Login, uso geral e criação de coleção com capa foram confirmados; os demais casos abaixo ainda precisam de validação específica. O APK debug é somente para testes. Uma distribuição definitiva exige assinatura própria; conserve a chave para futuras atualizações.

Checklist do piloto:
- Login, reinício do app, criação de conta e logout.
- Recuperação de senha: por enquanto o e-mail abre o site público. Ainda não há retorno por deep link ao APK.
- Fotos: selecionar capa e várias fotos, editar e visualizar.
- Exportação e importação JSON/JSON.GZ. O Android abre o seletor de compartilhamento para salvar o backup. Confirmar que o arquivo foi efetivamente salvo antes de excluir dados; a mensagem atual da interface pode anteceder o término do compartilhamento.
- Voltar: confirmação aberta, edição com alterações, galeria, tutorial e tela inicial. Alguns overlays precisam de tratamento específico após teste.
- Wishlist: links externos e análise. O endpoint está no domínio público e precisa aceitar a origem https://localhost usada pelo Capacitor (CORS).
- Teclado, rotação, recortes de tela, barras do sistema e animações.

O build mobile é separado do Netlify. Nenhuma publicação remota é necessária para gerar este piloto.
