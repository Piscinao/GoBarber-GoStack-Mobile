import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/aps';

interface AuthState {
  token: string;
  // Sem mostrar todas as proriedades
  user: object;
}
interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: object;
  loading: boolean;
  // transforma o método em async ele está obrigariamente retornando uma promise
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// componente para ser importado como contexto
const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token[1] && user[1]) {
        setData({token: token[1], user: JSON.parse(user[1])});
      }

      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async ({email, password}) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const {token, user} = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    // logo após login preenche o estado com as informações
    // enquanto o app estiver funcionando
    setData({token, user});
  }, []);

  const signOut = useCallback(async () => {
    // Limpa o token do AsyncStorage e seta o set data vazio
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{user: data.user, loading, signIn, signOut}}>
      {/* tudo o que o context provider recebe como filho irá estar repassando */}
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {useAuth, AuthProvider};
