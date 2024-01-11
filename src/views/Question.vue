<template>
  <ion-page>
    <ion-header :translucent="true" mode="ios">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title slot="start" v-if="user">Welkom {{user.name}}</ion-title>
        <ion-title v-else>Welkom bij mijn quiz</ion-title>
        <ion-title slot="end" v-if="selectedQuestion">Vraag {{ selectedQuestion.nr }} / {{
          colQuestions.length }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container" v-if="!authenticated">
        <ion-button @click="authenticate">Ik doe mee!</ion-button>
        <ion-button @click="isHost = true">Ik host de quiz</ion-button>
      </div>
      <div id="container" v-else-if="selectedQuestion">
        answer : {{ answer }}=>{{ isCorrect }}<br>
        <strong class="capitalize">{{ selectedQuestion.nr }}. {{ selectedQuestion.question }}</strong>
        <p v-if="selectedQuestion.description">{{ selectedQuestion.description }}</p>
        <ion-list>
          <ion-radio-group value="strawberries" v-model="answer">
            <ion-item v-for="(option, i) in selectedQuestion.options">
              <ion-radio :disabled="answer ? true : false" :value="i">{{ chars[i] }}. {{ option }}</ion-radio></ion-item>
          </ion-radio-group>
        </ion-list>
      </div>
      <div id="container" v-else>
        <strong class="capitalize">Wachten op het starten van de quiz</strong>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IonButtons, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonRadio, IonRadioGroup } from '@ionic/vue';
import { colQuestions, colUsers, saveDoc, selectedQuestion, authenticated, isHost, user } from '../firebase.js'
import { Dialog } from '@capacitor/dialog';

const chars = ['A', 'B', 'C', 'D']
const answer = ref()
//.value voor reaktieve variablenen en computed propeprties
let isCorrect= ref(false)

async function authenticate(){
  const { value, cancelled } = await Dialog.prompt({
    title: 'Aanmelden',
    message: `Wat is je naam?`,
  });
  if (cancelled) return 
  user.value = {name:value, score: 0}
  saveDoc('users',user.value)
  authenticated.value = true
}

watch(answer,(value)=>{//Beantwoorden van de vraag
  if (!selectedQuestion.value) return false
  isCorrect.value = (value == selectedQuestion.value.answer)
})

watch(selectedQuestion,(value)=>{ //Wijzigen van elke vraag
  if (isHost.value || !value || !authenticated.value) return false
  if (!isCorrect.value) { //als fout beantwoord
    authenticated.value = false
    Dialog.alert({
      title: 'Stop',
      message: 'Je ligt eruit',
    });
  } else {
    //saveDoc()
  }
  answer.value =null
  isCorrect.value = value
  
})
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 30%;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
