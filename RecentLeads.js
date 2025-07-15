import React from 'react';
import styles from '../../public/style.css';

const RecentLeads = ({ leads }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="recent-leads">
      <h3>Recent Leads</h3>
      <div className="leads-table-container">
        <table>
          <thead>
            <tr>
              <th>Offer ID</th>
              <th>Offer Name</th>
              <th>Date & Time</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={index}>
                <td>{lead.offerId}</td>
                <td>{lead.offerName}</td>
                <td>{formatDate(lead.datetime)}</td>
                <td>{lead.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;