<template>
  <ion-page>
    <ion-header :translucent="true" mode="ios">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title slot="start" v-if="quizz && user">Welkom {{user.name}} score: {{ user.score }}</ion-title>
        <ion-title v-else-if="quizz">Welkom bij {{ quizz.name }}</ion-title>
        <ion-title v-else>Welkom</ion-title>
        <ion-title slot="end" v-if="selectedQuestion">Vraag {{ selectedQuestion.nr }} / {{
          colQuestions.length }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      {{ currentUser }}
      <div id="container" v-if="isHost"><h1>U kunt beginnen met de quiz voor {{ colUsers.length }} deelnemers</h1></div>
      <div id="container" v-else-if="user && !user.playing"><h1>Bedankt voor het spelen {{ user.name }} u hebt verloren met een score van {{ user.score }}</h1></div>
      <div id="container" v-else-if="!user">
        <ion-input label="Quiz pin" type="number" v-model.number="nPin" placeholder="Geef de pin van de quiz"></ion-input>
        <ion-input label="Naam" v-model="tName" placeholder="Wat is je naam?"></ion-input>
        <ion-button @click="joinQuiz">Ik doe mee!</ion-button>
        <ion-button @click="hostQuiz">Ik host de quiz</ion-button>
      </div>
      <div id="container" v-else-if="selectedQuestion && user && user.playing">
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

<script setup>
import { ref, computed, watch } from 'vue';
import { IonButtons,IonInput, IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonRadio, IonRadioGroup } from '@ionic/vue';
import { colQuizz, quizz, colQuestions, colUsers, saveDoc, selectedQuestion, playing, isHost, user, currentUser } from '../firebase.js'
import { Dialog } from '@capacitor/dialog';
const nPin = ref()
const tName = ref()
const chars = ['A', 'B', 'C', 'D']
const answer = ref()
//.value voor reaktieve variablenen en computed propeprties
const  isCorrect= ref(false)

async function hostQuiz(){ //ask for pin
  colQuizz.value.filter((q)=>q.host==nPin.value).map((q)=>quizz.value = q)//Filter quislizt on host pin and set current quiz
  if (!quizz.value) return alert('Ongeldige pin')
  isHost.value=true
}


async function joinQuiz(){
  colQuizz.value.filter((q)=>q.pin==nPin.value).map((q)=>quizz.value = q) //Filter quislizt on pin and set current quiz
  if (!quizz.value) return alert('Ongeldige pin')
  if (!tName.value) return alert('Geef je naam op')
  const res = await saveDoc('users',{name:tName.value, score: 0})
  user.value = {id: res.id, name:tName.value, score: 0, playing: true}
}
watch(answer,(value)=>{//Beantwoorden van de vraag
  if (!selectedQuestion.value) return false
  isCorrect.value = (value == selectedQuestion.value.answer)
})

watch(selectedQuestion,(value,question)=>{ //Wijzigen van elke vraag
  if (isHost.value || !playing.value || !question) return false
  if (!isCorrect.value) { //als fout beantwoord
    user.value.playing = false    //signout player
    saveDoc("users",user.value) //Save state of user
  } else {
    user.value.score+=1
    saveDoc("users",user.value)
  }
  answer.value =null
  isCorrect.value = false
  
})

watch(currentUser,(value)=>{ //track changes host user delete
  if (!value) {
    user.value = null //logout
    quizz.value = null
  }
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
