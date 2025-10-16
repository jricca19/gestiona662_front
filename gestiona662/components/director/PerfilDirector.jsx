import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { desloguear } from '../../store/slices/usuarioSlice';
import * as SecureStore from 'expo-secure-store';
import { stylesPerfil } from '../styles/stylesPerfil';
import FotoPerfilUploader from '../FotoPerfilUploader';
import { Picker } from '@react-native-picker/picker';
import { URL_BACKEND } from '@env';

const PerfilDirector = ({ navigation }) => {
    const usuario = useSelector(state => state.usuario);
    const dispatch = useDispatch();

    const [escuelas, setEscuelas] = useState([]);
    const [escuelaSeleccionada, setEscuelaSeleccionada] = useState('')
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPerfil = async () => {
            const token = await SecureStore.getItemAsync('token');
            const resp = await fetch(`${URL_BACKEND}/v1/users/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await resp.json();
            setPerfil(data);
        };
        fetchPerfil();
        cargarEscuelas();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("isLogged");
        await SecureStore.deleteItemAsync("usuario");
        dispatch(desloguear());
    };

    const cargarEscuelas = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            setLoading(true);
            const response = await fetch(`${URL_BACKEND}/v1/schools/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const data = await response.json();
            setEscuelas(data || []);
            if (data && data.length > 0) {
                setEscuelaSeleccionada(data[0]._id);
            } else {
                setEscuelaSeleccionada('');
            }
        } catch (error) {
            console.error('Error al cargar escuelas:', error);
        }
        setLoading(false);
    };

    const handleEliminarEscuela = (codigo) => {
        setEscuelas(escuelas.filter(e => e !== codigo));
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={stylesPerfil.encabezado}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={stylesPerfil.botonAtras}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={stylesPerfil.textoEncabezado}>Perfil</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={stylesPerfil.contenedor}>
                    <ScrollView contentContainerStyle={stylesPerfil.contenidoScroll}>
                        <View style={stylesPerfil.avatarContainer}>
                            <FotoPerfilUploader
                                avatarStyle={stylesPerfil.avatar}
                                ciUsuario={usuario.ci}
                                profilePhoto={perfil?.profilePhoto}
                            />
                            <View>
                                <Text style={stylesPerfil.nombre}>{usuario.name} {usuario.lastName}</Text>
                                <Text style={stylesPerfil.rol}>Director/a</Text>
                            </View>
                        </View>

                        <View>
                            <Text style={stylesPerfil.tituloSeccion}>Tus Datos</Text>
                            <View style={stylesPerfil.datosSeccion}>
                                <Text style={stylesPerfil.subtituloCampo}>Email</Text>
                                <View style={stylesPerfil.filaSeccion}>
                                    <MaterialIcons name="email" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                    <Text style={stylesPerfil.textoFila}>{usuario.email || 'correo@dominio.com'}</Text>
                                </View>
                                <Text style={stylesPerfil.subtituloCampo}>Teléfono de contacto</Text>
                                <View style={stylesPerfil.filaSeccion}>
                                    <MaterialIcons name="phone" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                    <Text style={stylesPerfil.textoFila}>{usuario.phoneNumber || '+59892654987'}</Text>
                                </View>
                                <Text style={stylesPerfil.subtituloCampo}>C.I.</Text>
                                <View style={stylesPerfil.filaSeccion}>
                                    <MaterialIcons name="badge" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                    <Text style={stylesPerfil.textoFila}>{usuario.ci || '49086546'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={stylesPerfil.contenedorBotones}>
                            <TouchableOpacity style={stylesPerfil.botonEditar}>
                                <Text style={stylesPerfil.textoBotonEditar}>Editar Datos</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={stylesPerfil.escuelasContainer}>
                            <Text style={stylesPerfil.tituloSeccion}>Tus Escuelas</Text>
                            <View style={stylesPerfil.filaEscuelaInput}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#009fe3" />
                                ) : (
                                    <Picker
                                        selectedValue={escuelaSeleccionada}
                                        onValueChange={(itemValue) => setEscuelaSeleccionada(itemValue)}
                                        style={stylesPerfil.picker}
                                    >
                                        <Picker.Item label="Seleccione escuela..." value="" />
                                        {escuelas.map((escuela) => (
                                            <Picker.Item
                                                key={escuela._id}
                                                label={`Esc. ${escuela.schoolNumber} - ${escuela.cityName}`}
                                                value={escuela._id}
                                            />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                            <Text style={stylesPerfil.tituloCalificacion}>Calificación de escuela</Text>
                            <View style={stylesPerfil.filaCalificacion}>
                                <FontAwesome name="star" size={20} color="#009fe3" style={stylesPerfil.icono} />
                                <Text style={stylesPerfil.textoCalificacion}>4.9</Text>
                            </View>
                        </View>


                        <View style={stylesPerfil.contenedorBotones}>
                            <TouchableOpacity style={stylesPerfil.botonCerrarSesion} onPress={handleLogout}>
                                <Text style={stylesPerfil.textoCerrarSesion}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView >
        </View >
    );
};

export default PerfilDirector;
