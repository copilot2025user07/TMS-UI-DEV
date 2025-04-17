import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateTransactionData } from '../store/transactionSlice';
import { RootState } from '../store';

const paymentOptions = [
  { id: 'upi', name: 'UPI' },
  { id: 'neft', name: 'NEFT' },
  { id: 'imps', name: 'IMPS' },
  { id: 'rtgs', name: 'RTGS' },
];

const TransactionForm: React.FC = () => {
  const dispatch = useDispatch();
  const transactionData = useSelector((state: RootState) => state.transaction);
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors: any = {};
    const { amount, receiver, transactionId, upiId, selectedPaymentType } = transactionData;

    if (!receiver) errors.receiver = 'Receiver name is required.';
    if (!amount || +amount <= 0) errors.amount = 'Amount must be a positive number.';
    if (selectedPaymentType === 'upi' && !upiId) errors.upiId = 'UPI ID is required.';
    if (['neft', 'imps', 'rtgs'].includes(selectedPaymentType) && !transactionId)
      errors.transactionId = 'Transaction ID is required.';
    if (selectedPaymentType === 'upi' && upiId && !/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}$/.test(upiId))
      errors.upiId = 'Invalid UPI ID format.';

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API request, replace with your actual backend API
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', transactionData);
      setSuccessMessage('Transaction successfully submitted!');
    } catch (error) {
      setFormErrors({ apiError: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <h2>Transaction Management</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {formErrors.apiError && <div className="error-message">{formErrors.apiError}</div>}
      <form onSubmit={handleSubmit}>
        {/* Payment Type Dropdown */}
        <div className="form-group">
          <label htmlFor="paymentType">Payment Type</label>
          <select
            id="paymentType"
            value={transactionData.selectedPaymentType}
            onChange={(e) => dispatch(updateTransactionData({ selectedPaymentType: e.target.value }))}
            required
          >
            <option value="">Select Payment Type</option>
            {paymentOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {formErrors.selectedPaymentType && <span className="error-text">{formErrors.selectedPaymentType}</span>}
        </div>

        {/* Receiver Name */}
        <div className="form-group">
          <label htmlFor="receiver">Receiver Name</label>
          <input
            type="text"
            id="receiver"
            value={transactionData.receiver}
            onChange={(e) => dispatch(updateTransactionData({ receiver: e.target.value }))}
            placeholder="Enter receiver's name"
            required
          />
          {formErrors.receiver && <span className="error-text">{formErrors.receiver}</span>}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={transactionData.amount}
            onChange={(e) => dispatch(updateTransactionData({ amount: e.target.value }))}
            placeholder="Enter amount"
            required
          />
          {formErrors.amount && <span className="error-text">{formErrors.amount}</span>}
        </div>

        {/* Conditional Fields */}
        {transactionData.selectedPaymentType === 'upi' && (
          <div className="form-group">
            <label htmlFor="upiId">UPI ID</label>
            <input
              type="text"
              id="upiId"
              value={transactionData.upiId}
              onChange={(e) => dispatch(updateTransactionData({ upiId: e.target.value }))}
              placeholder="Enter UPI ID"
              required
            />
            {formErrors.upiId && <span className="error-text">{formErrors.upiId}</span>}
          </div>
        )}

        {['neft', 'imps', 'rtgs'].includes(transactionData.selectedPaymentType) && (
          <div className="form-group">
            <label htmlFor="transactionId">Transaction ID</label>
            <input
              type="text"
              id="transactionId"
              value={transactionData.transactionId}
              onChange={(e) => dispatch(updateTransactionData({ transactionId: e.target.value }))}
              placeholder="Enter transaction ID"
              required
            />
            {formErrors.transactionId && <span className="error-text">{formErrors.transactionId}</span>}
          </div>
        )}

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Submit Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
