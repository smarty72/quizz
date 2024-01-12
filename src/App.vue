<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay" :disabled="!isHost">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Quizz</ion-list-header>
            <ion-note>Created by Noah</ion-note>

            <ion-menu-toggle :auto-hide="false"> </ion-menu-toggle>
              <ion-item button @click="selectQuestion()" lines="none" :detail="true" class="hydrated">
                <ion-label>Start</ion-label>
              </ion-item>
              <ion-item  v-for="(p, i) in colQuestions" :key="i" button @click="selectQuestion(p)" lines="none" :detail="false" class="hydrated" :class="{ selected: p.selected }">
                <ion-icon aria-hidden="true" slot="start" :icon="mailOutline"></ion-icon>
                <ion-label>Vraag {{ p.nr }}</ion-label>
              </ion-item>
           
          </ion-list>

          <ion-list id="labels-list">
            <ion-list-header>Spelers</ion-list-header>

            <ion-item button v-for="(user, index) in colUsers" lines="none" :key="index">
              <ion-icon aria-hidden="true" slot="start" :ios="bookmarkOutline" :md="bookmarkSharp" @click="deleteDoc('users',user)"></ion-icon>
              <ion-label>{{ user.name }}</ion-label>
              <ion-label slot="end">{{ user.score }}</ion-label>
            </ion-item>
          </ion-list>
          <ion-button @click="addUser('Test')">Toevoegen</ion-button>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane, IonButton
} from '@ionic/vue';
import { ref, computed } from 'vue';
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  bookmarkSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
} from 'ionicons/icons';
import {colQuestions,colUsers, saveDoc, selectedQuestion,authenticated, deleteDoc ,isHost } from './firebase.js'




function selectQuestion(q?:any){
  //selectedQuestion.value.selected = false
  if (selectedQuestion.value) {
    const item = selectedQuestion.value
    item.selected = false
    saveDoc('questions',item)
  }
  if (!q) return false
  q.selected = true
  saveDoc('questions',q)
}

async function addUser(name:string){
  saveDoc('users',{
        name,
        score: 0,
        created: new Date()
      })
}
</script>

<style scoped>
.split-pane-side{
  --side-max-width: 200px;
}
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
