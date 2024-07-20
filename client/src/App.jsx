
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Main2 from './Main2';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Main2 />
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
