import { Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { loguear } from '../store/slices/usuarioSlice';
import { stylesLogin } from './styles/stylesLogin';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { colores } from './styles/fuentesyColores';
import { useState } from 'react';


const FormularioLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(t('validation.email'))
      .required(t('validation.required')),
    password: yup
      .string()
      .min(8, t('validation.min', { count: 8 }))
      .max(20, t('validation.min', { count: 20 }))
      .required(t('validation.required')),
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
      const response = await fetch('https://gestiona662-backend.vercel.app/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await SecureStore.setItemAsync("token", data.token);
        await SecureStore.setItemAsync("isLogged", "true");

        const profileResp = await fetch('https://gestiona662-backend.vercel.app/v1/users/profile', {
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
    <>
      <View style={stylesLogin.botonesIdiomas}>
        <TouchableOpacity
          style={i18n.language === 'es' ? stylesLogin.botonIdiomaElegido : stylesLogin.botonIdiomaSinElegir}
          onPress={() => i18n.changeLanguage('es')}
        >
          <Text style={i18n.language === 'es' ? stylesLogin.textoBtnIdiomaElegido : stylesLogin.textoBtnIdiomaSinElegir}>
            {t('login.es')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={i18n.language === 'en' ? stylesLogin.botonIdiomaElegido : stylesLogin.botonIdiomaSinElegir}
          onPress={() => i18n.changeLanguage('en')}
        >
          <Text style={i18n.language === 'en' ? stylesLogin.textoBtnIdiomaElegido : stylesLogin.textoBtnIdiomaSinElegir}>
            {t('login.en')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={stylesLogin.container}>
        <Image
          source={require('../assets/logo-login.png')}
          style={stylesLogin.logo}
        />
        <Text style={stylesLogin.titulo}>{t('login.title')}</Text>
        <Text style={stylesLogin.subtitulo}>{t('login.subtitle')}</Text>
        <View style={stylesLogin.filaInput}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={stylesLogin.input}
                placeholder={t('form.email')}
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
                placeholder={t('form.password')}
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
          <Text style={stylesLogin.textoBotonRecuperar}>{t('login.forgot')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesLogin.botonIniciarSesion}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colores.cuarto}/>
          ) : (
            <Text style={stylesLogin.textoBotonIniciarSesión}>{t('login.login')}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={stylesLogin.botonRegistrarse} onPress={irARegistro}>
          <Text style={stylesLogin.textoBotonRegistrarse}>{t('login.register')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FormularioLogin;