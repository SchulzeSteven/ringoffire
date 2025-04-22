import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-321d2","appId":"1:908817753249:web:ba38a442d8eca0ed24fce0","databaseURL":"https://ring-of-fire-321d2-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"ring-of-fire-321d2.firebasestorage.app","apiKey":"AIzaSyBIOBoOfpp2lZbLWaaoNm-xOMXmaAsgQjU","authDomain":"ring-of-fire-321d2.firebaseapp.com","messagingSenderId":"908817753249","measurementId":"G-CTB16VWXXJ"})), provideFirestore(() => getFirestore())]
};
