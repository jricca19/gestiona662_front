import { Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { loguear } from '../store/slices/usuarioSlice';
import { stylesLogin } from './styles/stylesLogin';
import { colores } from './styles/fuentesyColores';
import { useState } from 'react';
import { URL_BACKEND } from '@env';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Correo electrónico inválido')
      .required('Este campo es obligatorio'),
    password: yup
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(20, 'La contraseña debe tener máximo 20 caracteres')
      .required('Este campo es obligatorio'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_BACKEND}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("token", data.token);
        await SecureStore.setItemAsync("isLogged", "true");

        const profileResp = await fetch(`${URL_BACKEND}/v1/users/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json',
          }
        });

        const profile = await profileResp.json();

        const usuario = {
          name: profile.name,
          lastName: profile.lastName,
          email: profile.email,
          role: profile.role,
          ci: profile.ci,
          phoneNumber: profile.phoneNumber
        };

        await SecureStore.setItemAsync("usuario", JSON.stringify(usuario));
        dispatch(loguear(usuario));
      } else {
        Alert.alert('Error', data?.message || 'Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
    setLoading(false);
  };

  const irARegistro = () => {
    navigation.replace("registro");
  };

  return (
    <View style={stylesLogin.container}>
      <Image
        source={require('../assets/logo-login.png')}
        style={stylesLogin.logo}
      />
      <Text style={stylesLogin.titulo}>Iniciar sesión</Text>
      <Text style={stylesLogin.subtitulo}>Ingresa tus credenciales para acceder</Text>
      <View style={stylesLogin.filaInput}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={stylesLogin.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              placeholderTextColor={colores.tercearioOscuro}
            />
          )}
        />
        {errors.email && <Text style={stylesLogin.error}>{errors.email.message}</Text>}
      </View>
      <View style={stylesLogin.filaInput}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={stylesLogin.input}
              placeholder="Contraseña"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              placeholderTextColor={colores.tercearioOscuro}
            />
          )}
        />
        {errors.password && <Text style={stylesLogin.error}>{errors.password.message}</Text>}
      </View>
      <TouchableOpacity style={stylesLogin.botonRecuperar}>
        <Text style={stylesLogin.textoBotonRecuperar}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={stylesLogin.botonIniciarSesion}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colores.cuarto} />
        ) : (
          <Text style={stylesLogin.textoBotonIniciarSesión}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={stylesLogin.botonRegistrarse} onPress={irARegistro}>
        <Text style={stylesLogin.textoBotonRegistrarse}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;