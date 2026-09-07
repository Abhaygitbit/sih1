import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';

// Load environment variables from both .env and fallback to .env.example
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.example') });

export default defineConfig(() => {
  const apiKey = process.env.VITE_FIREBASE_API_KEY || "AIzaSyDHy8QKsDGL__RHatZXAXBO2HMXRtUzH-4";
  const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN || "sih-auth-ip-shakti.firebaseapp.com";
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "sih-auth-ip-shakti";
  const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || "sih-auth-ip-shakti.firebasestorage.app";
  const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "4857411568";
  const appId = process.env.VITE_FIREBASE_APP_ID || "1:4857411568:web:eee94c45707b075808cf35";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    define: {
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(authDomain),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(projectId),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(storageBucket),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(messagingSenderId),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(appId),
    }
  };
});
