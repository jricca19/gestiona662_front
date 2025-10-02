import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, Text, StyleSheet, TouchableOpacity, Dimensions, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Clipboard from 'expo-clipboard';
import { colores, tamanos } from './styles/fuentesyColores';
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificacionesPush({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [copiado, setCopiado] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const registrarNotificaciones = async () => {
      let token;

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert('Permiso denegado', 'No se puede obtener token de notificación');
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      } else {
        Alert.alert('Error', 'Debe usar un dispositivo físico para notificaciones push');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    registrarNotificaciones();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // App en primer plano, mostrar popup
      console.log('Notificación recibida:', notification);
      const title = notification.request?.content?.title || '';
      const body = notification.request?.content?.body || '';
      Alert.alert(title, body);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Usuario tocó la notificación: navegar a "publicaciones"
      console.log('Respuesta a la notificación:', response);
      navigation.navigate('maestroTabs', { screen: 'publicaciones' });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [navigation]);

  const copiarAlPortapapeles = async () => {
    await Clipboard.setStringAsync(expoPushToken);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.tituloEncabezado}>Notificaciones</Text>
        <View style={{ width: 28 }} />
      </View>
      <Text style={styles.title}>Token para pruebas desde Postman</Text>
      <Text selectable style={styles.token}>{expoPushToken}</Text>
      <TouchableOpacity style={styles.botonCopiar} onPress={copiarAlPortapapeles}>
        <Ionicons name="copy-outline" size={22} color="#fff" />
        <Text style={styles.textoBoton}>Copiar token</Text>
      </TouchableOpacity>
      {copiado && (
        <Text style={styles.textoCopiado}>¡Token copiado al portapapeles!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    backgroundColor: colores.primario,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tituloEncabezado: {
    color: colores.terceario,
    fontSize: tamanos.titulo1,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: width * 0.05,
  },
  token: {
    fontSize: 16,
    color: colores.quinto,
    backgroundColor: colores.cuarto,
    margin: width * 0.05,
    padding: width * 0.02,
    borderWidth: 1,
    borderColor: colores.tercearioOscuro,
    borderRadius: 8
  },
  botonCopiar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.primario,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'center'
  },
  textoBoton: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold'
  },
  textoCopiado: {
    color: colores.letrasExito,
    marginTop: 10,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
});