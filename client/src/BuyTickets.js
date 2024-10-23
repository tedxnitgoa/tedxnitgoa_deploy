import React, { useState, useEffect } from 'react';
import './BuyTickets.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const BuyTickets = () => {
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'general',
    quantity: 1
  });
  const [availableTickets, setAvailableTickets] = useState(100);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    fetchAvailableTickets();
  }, []);

  const fetchAvailableTickets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/available-tickets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvailableTickets(data.availableTickets);
    } catch (error) {
      console.error('Error fetching available tickets:', error);
      setError('Unable to fetch available tickets. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const { orderId, amount, currency, razorpayKeyId } = await response.json();

      const options = {
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        name: 'TEDxNIT GOA',
        description: 'Ticket Purchase',
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount,
                ticketType: ticketData.ticketType,
                quantity: ticketData.quantity,
                name: ticketData.name,
                email: ticketData.email,
                phone: ticketData.phone
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setDialogMessage('Payment successful! Your ticket is ready for download.');
              setPdfUrl(verifyData.pdfUrl);
              setDialogOpen(true);
              fetchAvailableTickets();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: ticketData.name,
          email: ticketData.email,
          contact: ticketData.phone
        },
        theme: {
          color: '#e62b1e'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPdfUrl(null);
    setTicketData({
      name: '',
      email: '',
      phone: '',
      ticketType: 'general',
      quantity: 1
    });
  };

  const handleDownloadTicket = () => {
    if (pdfUrl) {
      window.open(`${API_BASE_URL}${pdfUrl}`, '_blank');
    }
  };

  if (availableTickets === 0) {
    return (
      <div className="buy-tickets-container">
        <h1 className="buy-tickets-title">Tickets Sold Out</h1>
        <p>We're sorry, but all tickets have been sold.</p>
      </div>
    );
  }

  return (
    <div className="buy-tickets-container">
      <h1 className="buy-tickets-title">Buy Tickets for TEDxNIT Goa</h1>
      <p className="tickets-available">Tickets available: {availableTickets}</p>
      <p className="IMP-Note">Note: please wait for pdf after the paymnet</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="buy-tickets-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={ticketData.name}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={ticketData.email}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={ticketData.phone}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ticketType">Ticket Type:</label>
          <select
            id="ticketType"
            name="ticketType"
            value={ticketData.ticketType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="general">General</option>
            {/* <option value="vip">VIP</option>
            <option value="student">Student</option> */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={ticketData.quantity}
            onChange={handleInputChange}
            min="1"
            max="100"
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading || availableTickets === 0}>
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
      {dialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <p>{dialogMessage}</p>
            {pdfUrl && (
              <button onClick={handleDownloadTicket} className="download-button">
                Download Ticket
              </button>
            )}
            <button onClick={handleCloseDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTickets;