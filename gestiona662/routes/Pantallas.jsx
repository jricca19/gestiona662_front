import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Login from '../components/Login'
import Registro from '../components/Registro'
import HomeMaestro from '../components/maestro/HomeMaestro'
import HomeDirector from '../components/director/HomeDirector'
import PerfilMaestro from '../components/maestro/PerfilMaestro'
import PerfilDirector from '../components/director/PerfilDirector'
import PostulacionesMaestro  from '../components/maestro/PostulacionesMaestro'
import PublicacionesDirector from '../components/director/PublicacionesDirector'
import PostulacionesDirector from '../components/director/PostulacionesDirector'
import Publicaciones from '../components/maestro/Publicaciones'
import DetallesPublicacion from '../components/maestro/DetallesPublicacion'
import PostulacionExitosa from '../components/maestro/PostulacionExitosa'
import CrearPublicacionDirector from '../components/director/CrearPublicacionDirector'
import DetallesPostulacion from '../components/maestro/DetallesPostulacion'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { Dimensions } from 'react-native'
import Observador from '../components/Observador'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const { height } = Dimensions.get('window');
const TAB_BAR_HEIGHT = height * 0.07;

function MaestroTabs() {
  return (
    <>
      <Observador />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#009BDB',
          tabBarInactiveTintColor: '#333333',
          tabBarStyle: { 
            height: TAB_BAR_HEIGHT,
            backgroundColor: '#FAFAFA',
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'homeMaestro') return <Ionicons name="home" size={size} color={color} />;
            if (route.name === 'publicaciones') return <Ionicons name="search-outline" size={size} color={color} />;
            if (route.name === 'misPostulaciones') return <Ionicons name="list-outline" size={size} color={color} />;
            if (route.name === 'perfilMaestro') return <Ionicons name="person-circle-outline" size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="homeMaestro" component={HomeMaestro} options={{ title: 'Inicio' }} />
        <Tab.Screen name="publicaciones" component={Publicaciones} options={{ title: 'Buscar Suplencias' }} />
        <Tab.Screen name="misPostulaciones" component={PostulacionesMaestro} options={{ title: 'Mis Postulaciones' }} />
        <Tab.Screen name="perfilMaestro" component={PerfilMaestro} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </>
  );
}

function DirectorTabs() {
  return (
    <>
      <Observador />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#009BDB',
          tabBarInactiveTintColor: '#333333',
          tabBarStyle: { 
            height: TAB_BAR_HEIGHT,
            backgroundColor: '#FAFAFA',
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'homeDirector') return <Ionicons name="home" size={size} color={color} />;
            if (route.name === 'crearPublicacion') return <Ionicons name="add-circle-outline" size={size} color={color} />;
            if (route.name === 'misPublicaciones') return <Ionicons name="list-outline" size={size} color={color} />;
            if (route.name === 'perfilDirector') return <Ionicons name="person-circle-outline" size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="homeDirector" component={HomeDirector} options={{ title: 'Inicio' }} />
        <Tab.Screen name="crearPublicacion" component={CrearPublicacionDirector} options={{ title: 'Crear Publicación' }} />
        <Tab.Screen name="misPublicaciones" component={PublicacionesDirector} options={{ title: 'Mis Publicaciones' }} />
        <Tab.Screen name="perfilDirector" component={PerfilDirector} options={{ title: 'Perfil' }} />
      </Tab.Navigator>
    </>
  );
}

function PilaInicio() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="registro" component={Registro} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MaestroStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="maestroTabs" component={MaestroTabs} options={{ headerShown: false }} />
      <Stack.Screen name="detallesPublicacion" component={DetallesPublicacion} options={{ headerShown: false }} />
      <Stack.Screen name="postulacionExitosa" component={PostulacionExitosa} options={{ headerShown: false }} />
      <Stack.Screen name="detallesPostulacion" component={DetallesPostulacion} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function DirectorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="directorTabs" component={DirectorTabs} options={{ headerShown: false }} />
      <Stack.Screen name="postulacionesPublicacion" component={PostulacionesDirector} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const Pantallas = () => {
  const { logueado, role } = useSelector(state => state.usuario);

  if (!logueado) return <PilaInicio />;
  if (role === 'TEACHER') return <MaestroStack />;
  return <DirectorStack />;
}

export default Pantallas