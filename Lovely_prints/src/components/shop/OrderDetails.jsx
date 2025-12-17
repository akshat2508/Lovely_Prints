import React from 'react';

export default function OrderDetails({ order, onStatusChange }) {
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'printing',
      printing: 'ready',
      ready: 'collected',
      collected: null
    };
    return statusFlow[currentStatus];
  };

  const getActionLabel = (currentStatus) => {
    const labels = {
      pending: 'Start Printing',
      printing: 'Mark Ready',
      ready: 'Mark Collected',
      collected: null
    };
    return labels[currentStatus];
  };

  const nextStatus = getNextStatus(order.status);
  const actionLabel = getActionLabel(order.status);

  return (
    <div className={`order-card ${order.isExpress ? 'express' : ''} ${order.status === 'collected' ? 'collected' : ''}`}>
      <div className="order-header">
        <div className="order-id">#{order.id}</div>
        {order.isExpress && <span className="express-badge">⚡ Express</span>}
        <span className={`status-badge ${order.status}`}>{order.status}</span>
      </div>
      
      <div className="order-body">
        <div className="student-info">
          <h3>{order.studentName}</h3>
          <p className="student-id">{order.studentId}</p>
        </div>
        
        <div className="document-info">
          <p className="document-name">{order.documentName}</p>
          {order.documentUrl && (
            <a 
              href={order.documentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-button"
            >
              Download
            </a>
          )}
        </div>
        
        <div className="print-details">
          <span>Paper: {order.paperType}</span>
          <span>Size: {order.size}</span>
          <span>Copies: {order.copies}</span>
        </div>
        
        <div className="order-footer">
          <span className="eta">ETA: {order.eta}</span>
          {nextStatus && (
            <button
              className="action-button"
              onClick={() => onStatusChange(order.id, nextStatus)}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}