import React from 'react';

import {AuthProvider} from './auth';

// Hook global
const AppProvider: React.FC = ({children}) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
