// إعدادات Firebase
// ملاحظة: هذا الملف يعمل مع مكتبات Firebase compat المحملة في الصفحات.

const firebaseConfig = {
  apiKey: "AIzaSyCJ8oMiSFFmPQfmHTMnMH27lKLdIzHmC1A",
  authDomain: "haithamsalama-c0333.firebaseapp.com",
  databaseURL: "https://haithamsalama-c0333-default-rtdb.firebaseio.com",
  projectId: "haithamsalama-c0333",
  storageBucket: "haithamsalama-c0333.firebasestorage.app",
  messagingSenderId: "433621608617",
  appId: "1:433621608617:web:4ddd0cbd36e20e352b61b8",
  measurementId: "G-R4SZ968QBR"
};

if (typeof firebase === 'undefined' || firebase === null) {
  console.error('Firebase compat libraries غير محملة. تأكد من تحميل firebase-app-compat.js و firebase-firestore-compat.js قبل config-firebase.js، ولا تفتح الصفحة مباشرة من file://. استخدم خادماً محلياً مثل http://localhost.');
} else {
  try {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }

    window.firebase = firebase;
    window.db = window.db || (firebase.firestore ? firebase.firestore() : null);

    if (!window.db) {
      console.error('Firestore compat API غير متوفرة بعد تحميل المكتبات.');
    }
  } catch (error) {
    if (!/already exists/.test(error.message)) {
      console.error('Firebase initialization error:', error);
    }
    window.db = window.db || (firebase.firestore ? firebase.firestore() : null);
  }
}
