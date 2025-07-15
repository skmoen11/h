import React, { useState, useEffect } from 'react';
import LeadCounter from '../components/LeadCounter';
import RecentLeads from '../components/RecentLeads';
import Head from 'next/head';

const Home = () => {
  const [leadData, setLeadData] = useState({
    totalLeads: 0,
    todaysLeads: 0,
    recentLeads: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeadData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Professional Lead Tracker</title>
        <meta name="description" content="Real-time lead tracking dashboard" />
      </Head>
      
      <div className="dashboard">
        <header>
          <h1>Lead Tracker Dashboard</h1>
          <p>Real-time lead monitoring for your affiliate campaigns</p>
        </header>
        
        <div className="counters-container">
          <LeadCounter title="Total Leads" count={leadData.totalLeads} />
          <LeadCounter title="Today's Leads" count={leadData.todaysLeads} />
        </div>
        
        <RecentLeads leads={leadData.recentLeads} />
      </div>
    </>
  );
};

export default Home;