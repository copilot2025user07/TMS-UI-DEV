import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionState {
  selectedPaymentType: string;
  amount: string;
  receiver: string;
  transactionId: string;
  upiId: string;
}

const initialState: TransactionState = {
  selectedPaymentType: '',
  amount: '',
  receiver: '',
  transactionId: '',
  upiId: '',
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    updateTransactionData: (state, action: PayloadAction<Partial<TransactionState>>) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { updateTransactionData } = transactionSlice.actions;
export default transactionSlice.reducer;
