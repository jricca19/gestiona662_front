import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Pantallas from './routes/Pantallas';
import { store } from './store/store';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { loguear, desloguear } from './store/slices/usuarioSlice';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { jwtDecode } from "jwt-decode";

function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp && decoded.exp > now;
  } catch {
    return false;
  }
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const isLoggedStorage = await SecureStore.getItemAsync("isLogged");
        const token = await SecureStore.getItemAsync("token");
        if (isLoggedStorage === "true" && isTokenValid(token)) {
          // Restaurar perfil de usuario
          const usuarioStr = await SecureStore.getItemAsync("usuario");
          if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            dispatch(loguear(usuario));
          } else {
            // Si no hay datos de usuario en SecureStore, limpiar el estado del store
            dispatch(desloguear());
          }
        } else {
          // Token inválido o expirado, limpiar estado y storage
          await SecureStore.deleteItemAsync("token");
          await SecureStore.deleteItemAsync("isLogged");
          await SecureStore.deleteItemAsync("usuario");
          dispatch(desloguear());
        }
      } catch (error) {
        dispatch(desloguear());
      } finally {
        setLoading(false);
      }
    }
    verificarSesion();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#009BDB" />
          <Text>Cargando...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#009BDB' }} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <NavigationContainer>
          <Pantallas />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
