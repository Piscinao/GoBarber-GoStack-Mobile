import React from 'react';

import {AuthProvider} from './auth';

// Hook Global
const AppProvider: React.FC = ({children}) => (
  <AuthProvider>{children}</AuthProvider>
);

export default AppProvider;
