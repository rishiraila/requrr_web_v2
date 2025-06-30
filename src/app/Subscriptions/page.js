'use client'
import React from 'react'
import SubscribeButton from '../components/SubscribeButton'

export default function Page() {

   function decodeJWT(token) {
        if (!token) return null;
        const payload = token.split('.')[1];
        try {
            return JSON.parse(atob(payload));
        } catch (e) {
            console.error('Invalid token', e);
            return null;
        }
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData = decodeJWT(token);

    // For debugging
    console.log("Decoded token:", userData.id);
  

  const userId =userData.id;

  return (
    <div>

    <SubscribeButton userId={userId} />

    </div>
  )
}
