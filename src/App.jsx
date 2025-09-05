import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import MyFiles from './pages/MyFiles';
import Transactions from './pages/Transactions';
import Subscription from './pages/Subscription';
import PublicFileView from './pages/PublicFileView';
import { RedirectToSignIn, SignedOut, SignedIn, RedirectToSignUp } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { UserCreditsProvider } from './context/UserCreditsContext.jsx';


const App = () => {
  return (
    <UserCreditsProvider>
    <Router>
      <Toaster />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/dashboard' element={
          <>
          <SignedIn><Dashboard /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path='/upload' element={
          <>
          <SignedIn><Upload /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path='/my-files' element={
          <>
          <SignedIn><MyFiles /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path='/subscriptions' element={
          <>
          <SignedIn><Subscription /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path='/transactions' element={
          <>
          <SignedIn><Transactions /></SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path='file/:fileId' element={
          <>
          <PublicFileView />
          </>
        }/>
        <Route path='/*' element={<RedirectToSignUp/>} />
      </Routes>
    </Router>
    </UserCreditsProvider>
  )
}

export default App
