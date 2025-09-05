import React from 'react'
import { StrictMode } from 'react'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import ReactDOM from 'react-dom/client'

const clerkPubKey= import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


ReactDOM.createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={clerkPubKey}>
        <App />
    </ClerkProvider>
        
   
);
