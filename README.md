# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).

# TUTORIAL PARA USAR O APP NO VSCODE
Instalar a extensão react native tools e a extensão code runner

npm i  
npm install -g expo-cli   
npx expo install react-dom  
npx expo install react-native-web @expo/metro-runtime ***(caso queira rodar no navegador)**  
npx expo start  
**após esse comando, aperte a letra "a" para rodar o app no android, w para rodar na web ou escaneie o código qr com o expo do seu celular físico. Precisa ter o android studio e um emulador configurado e aberto!**

Esse comando npx expo start, criará um qr code, possibilitando também o uso no seu app expo do celular. Caso queira criar a pasta android, para trabalhar com código nativo use o comando:  
npx expo prebuild  
Mas acredito que não precisa, pois já criei

Para gerar o app:  
  
npm install -g eas-cli  
eas build:configure  
eas build -p android --profile preview  

