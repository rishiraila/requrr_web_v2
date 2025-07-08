// /context/AppContext.js
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [clientCount, setClientCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  // ✅ Fetch counts once when the app loads
  useEffect(() => {
    const fetchInitialCounts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [clientsRes, servicesRes] = await Promise.all([
          axios.get('/api/clients', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/Services', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setClientCount(clientsRes.data.length);
        setServiceCount(servicesRes.data.length);
      } catch (error) {
        console.error('Failed to fetch initial counts:', error);
      }
    };

    fetchInitialCounts();
  }, []); 

  return (
    <AppContext.Provider value={{ clientCount, setClientCount, serviceCount, setServiceCount }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
