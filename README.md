# 🐾 PetFlow

## 📱 Sobre o Projeto
O **PetFlow** é um aplicativo mobile desenvolvido com React Native + Expo, com o objetivo de acompanhar o fluxo contínuo da saúde do pet.

A aplicação busca resolver um problema comum: tutores só cuidam dos pets em situações de emergência. O PetFlow propõe uma abordagem preventiva, automatizando lembretes, histórico e rotina de cuidados.

---

## 🎯 Objetivo
Criar uma solução digital que:
- Lembre automaticamente cuidados (vacinas, remédios, check-ups)
- Armazene o histórico do pet
- Personalize a experiência com base no perfil do animal
- Incentive uma rotina contínua de saúde

---

## 🚀 Funcionalidades

- 📋 Cadastro de Pet
- 🔔 Lembretes automáticos (vacina, medicamentos, check-up)
- 📊 Histórico de saúde
- 🐶 Perfil do Pet
- 💾 Persistência de dados com AsyncStorage

---

## 📱 Telas do Aplicativo

- Home
- Cadastro de Pet
- Perfil do Pet
- Lembretes
- Histórico

---

## 🔄 Fluxo do App

1. Usuário abre o app  
2. Cadastra seu pet  
3. O app gera lembretes automáticos  
4. O usuário acompanha a rotina do pet  
5. Os dados ficam salvos mesmo após fechar o app  

---

## 🛠️ Tecnologias Utilizadas

- React Native
- Expo
- JavaScript
- AsyncStorage
- React Navigation

---

## 💾 Armazenamento de Dados

Os dados são armazenados localmente utilizando AsyncStorage:

```js
await AsyncStorage.setItem("pet", JSON.stringify(pet));