importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q",
  authDomain: "eventlytics-493710.firebaseapp.com",
  projectId: "eventlytics-493710",
  storageBucket: "eventlytics-493710.appspot.com",
  messagingSenderId: "252675432928",
  appId: "1:252675432928:web:7f6a7d5b4c3e2f1a098"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
