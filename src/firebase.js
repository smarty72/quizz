import { initializeApp } from 'firebase/app';
import { useCollection } from 'vuefire'
import { getAuth, signInAnonymously } from "firebase/auth";
import { setDoc, doc, getDoc,getFirestore, query,collection, orderBy, addDoc }  from 'firebase/firestore';
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

export const colQuestions = useCollection(query(collection(db, 'questions'),orderBy('nr')))
export const colUsers = useCollection(query(collection(db, 'users'),orderBy('score','desc')))
export const selectedQuestion =computed(() =>colQuestions.value.filter(q=>q.selected)[0] )
export const authenticated = ref(false)
export const isHost = ref(false)
export const user = ref()


export async  function saveDoc(c,item){
  if (item.id){
      return await setDoc(doc(collection(db, c), item.id),item)
  }else{
    return await addDoc(collection(db, c),item)
  }
}

/*
export const fb = {
  database(){
    return firebase.database()
  },
  collection (c) {
    return  collection(db,c)
  },
  docRef (index, c) {
    return  doc(db, c , index);
  },
  items: async function(c,ids) {
    const result = await db.collection(c).where(firebase.firestore.FieldPath.documentId(), 'in', ids).get()
    //let col = db.collection(c).get()
    let list = []
    result.docs.forEach(function(doc) {
      let item = doc.data()
      item.id = doc.id
      list.push(item)
    })
    return list
  },
  list: async function(c,q) {
    const col = this.collection(c)
    let list = [], result = []
    if (!q) {
      return useCollection(col)
    }else {
      const q = query(col, where("_id", "==", 'test'));
    }
    result.forEach(function(doc) {
      list.push(doc.data())
    })
    return list
  },
  clear: async function (index){
    await deleteDoc(this.docRef(index))
    return {status: 'OK'}
  },
  item: async function(index,c) {
    let doc = await getDoc(this.docRef(index))
    return  doc.data()
  },
  async set (item,c,index){
    return await setDoc(getDoc(db,c,index),item)
  },
  async update(index,c, upd){
    const docRef = doc(db, c, index);
    try {
      await updateDoc(docRef, upd);
    }catch(e){
      console.log(e)
    }
  },
  save (item,c){
    setDoc(this.docRef(item.id,c),item)
    
  }
}

//exports.firebase = firebase*/