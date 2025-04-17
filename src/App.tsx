import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import TransactionForm from './components/TransactionForm';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <TransactionForm />
      </div>
    </Provider>
  );
};

export default App;
