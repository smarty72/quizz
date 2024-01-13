import { initializeApp } from 'firebase/app';
import { useCollection } from 'vuefire'
import { getAuth, signInAnonymously } from "firebase/auth";
import { setDoc, deleteDoc, doc, getDoc,getFirestore, query,collection, orderBy, addDoc }  from 'firebase/firestore';
import { ref, computed } from 'vue';


const app = initializeApp({
  apiKey: "AIzaSyAvLVezzPLDjG8UKkQejIiCkZATaXG2uIs",
authDomain: "quizz-127ca.firebaseapp.com",
projectId: "quizz-127ca",
storageBucket: "quizz-127ca.appspot.com",
messagingSenderId: "956457625466",
appId: "1:956457625466:web:20cfc8a5dfeeee16cb18c3"
})//lite.getFirestore(app);

const auth = getAuth(app);
signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
export const db = getFirestore(app)

export const colQuizz = useCollection(collection(db, 'quizz'))
export const colQuestions = useCollection(query(collection(db, 'questions'),orderBy('nr')))
export const colUsers = useCollection(query(collection(db, 'users'),orderBy('score','desc')))
export const selectedQuestion =computed(() =>colQuestions.value.filter(q=>q.selected)[0] )

export const quizz = ref()
export const isHost = ref(false)
export const user = ref()
export const currentUser =computed(() =>colUsers.value.filter(u=>user.value && u.id == user.value.id)[0]) //track current online user

export const playing = computed(()=>user.value && user.value.playing ? true : false )

export async  function saveDoc(c:string,item:any){
  if (item.id){
      return await setDoc(doc(collection(db, c), item.id),item)
  }else{
    return await addDoc(collection(db, c),item)
  }
}

export async function deleteItem(c:string,item:any){
  await deleteDoc(doc(db, c, item.id));
}
