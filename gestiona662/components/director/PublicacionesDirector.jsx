import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Image } from 'react-native'
import { estilosPublicacionesDirector } from '../styles/stylesPublicacionesDirector';
import { useState, useEffect, useCallback } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import { colores } from '../styles/fuentesyColores';
import { formatoFecha } from '../../utils/dates';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { URL_BACKEND } from '@env';
import AppSnackbar from '../AppSnackbar';

const PublicacionesDirector = ({ navigation, route }) => {
    const [datos, setDatos] = useState([]);
    const [escuelas, setEscuelas] = useState([]);
    const [escuelaSeleccionada, setEscuelaSeleccionada] = useState('');
    const [postulaciones, setPostulaciones] = useState({});
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchPublicaciones = useCallback(async (pageToLoad = 1, refreshing = false) => {
        if (loading) return;
        if (!refreshing && total && datos.length >= total) return;
        setLoading(true);
        setError(null);
        try {
            const token = await SecureStore.getItemAsync('token');

            const res = await fetch(`${URL_BACKEND}/v1/publications/school/${escuelaSeleccionada}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const text = await res.text();

            if (res.status === 200 && res.headers.get('content-type')?.includes('application/json')) {
                const data = JSON.parse(text);
                // El backend devuelve un array de publicaciones con las postulaciones embebidas
                const publicaciones = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
                setTotal(publicaciones.length);
                setDatos(publicaciones);
                // Construir el mapa de postulaciones a partir de la respuesta
                const nuevoMapa = {};
                for (const pub of publicaciones) {
                    nuevoMapa[pub._id] = Array.isArray(pub.postulations) ? pub.postulations : [];
                }
                setPostulaciones(nuevoMapa);
            } else {
                setError('Error inesperado al obtener publicaciones');
            }
        } catch (err) {
            setError('Error de red o servidor');
        }
        setLoading(false);
    }, [loading, datos.length, total, escuelaSeleccionada]);

    useEffect(() => {
        if (escuelaSeleccionada) {
            setPage(1);
            fetchPublicaciones(1, true);
        }
    }, [escuelaSeleccionada]);

    useEffect(() => {
        const obtenerEscuelas = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');

                const res = await fetch(`${URL_BACKEND}/v1/schools/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setEscuelas(data);
                    if (data.length > 0) {
                        setEscuelaSeleccionada(data[0]._id);
                    }
                } else {
                    console.error('Error al obtener escuelas:', data.message || 'Respuesta no OK');
                }
            } catch (error) {
                console.error('Error al cargar escuelas:', error);
            }
        };

        obtenerEscuelas();
    }, []);

    useEffect(() => {
        if (route?.params?.refresh) {
            setPage(1);
            fetchPublicaciones(1, true);
            navigation.setParams({ refresh: false });
        }
    }, [route?.params?.refresh]);

    // Mostrar snackbar de "flash" si viene desde otra pantalla
    useEffect(() => {
        const msg = route?.params?.flashMessage;
        if (msg) {
            setSnackbarMessage(msg);
            setSnackbarVisible(true);
            // limpiar para que no vuelva a mostrarse
            navigation.setParams({ flashMessage: undefined });
        }
    }, [route?.params?.flashMessage]);

    const handleLoadMore = () => {
        if (loading) return;
        if (datos.length >= total) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPublicaciones(nextPage);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchPublicaciones(1, true).then(() => setRefreshing(false));
    };

    // Sincronizar el mapa de postulaciones desde los datos (evita llamadas por publicación)
    useEffect(() => {
        if (Array.isArray(datos)) {
            const map = {};
            for (const pub of datos) {
                map[pub._id] = Array.isArray(pub.postulations) ? pub.postulations : [];
            }
            setPostulaciones(map);
        }
    }, [datos]);

    const estados = {
        OPEN: {
            label: 'Abierta',
            style: estilosPublicacionesDirector.badgePendiente,
            textStyle: estilosPublicacionesDirector.badgePendienteText
        },
        FILLED: {
            label: 'Cubierta',
            style: estilosPublicacionesDirector.badgeAsignada,
            textStyle: estilosPublicacionesDirector.badgeAsignadaText
        },
        CANCELLED: {
            label: 'Cancelada',
            style: estilosPublicacionesDirector.badgeRechazada,
            textStyle: estilosPublicacionesDirector.badgeRechazadaText
        },
        EXPIRED: {
            label: 'Expirada',
            style: estilosPublicacionesDirector.badgeRechazada,
            textStyle: estilosPublicacionesDirector.badgeRechazadaText
        },
        COMPLETED: {
            label: 'Finalizada',
            style: estilosPublicacionesDirector.badgeAsignada,
            textStyle: estilosPublicacionesDirector.badgeAsignadaText
        }
    };

    const renderItem = ({ item }) => {
        let fechaFormateada = '';
        if (item.startDate && item.endDate) {
            fechaFormateada =
                formatoFecha(item.startDate, 'dd') +
                '-' +
                formatoFecha(item.endDate, 'dd MMM yyyy');
        }

        const estado = estados[item.status] || {
            label: item.status,
            style: estilosPublicacionesDirector.badgePendiente,
            textStyle: estilosPublicacionesDirector.badgePendienteText
        };

        return (
            <View style={estilosPublicacionesDirector.tarjeta} key={item._id}>
                <View style={estilosPublicacionesDirector.encabezadoTarjeta}>
                    <View style={estilosPublicacionesDirector.filaTarjeta}>
                        <MaterialIcons name="show-chart" size={18} color={colores.primario} />
                        <Text style={estilosPublicacionesDirector.textoTarjeta}>
                            {item.grade === 0 ? 'Nivel Inicial' : `${item.grade}°`}
                        </Text>
                    </View>
                    <View style={[estilosPublicacionesDirector.badgeStatus, estado.style]}>
                        <Text style={[estilosPublicacionesDirector.badgeStatusText, estado.textStyle]}>
                            {estado.label}
                        </Text>
                    </View>
                </View>
                <View style={estilosPublicacionesDirector.filaTarjeta}>
                    <MaterialIcons name="event" size={18} color={colores.primario} />
                    <Text style={estilosPublicacionesDirector.textoTarjeta}>
                        {fechaFormateada}
                    </Text>
                </View>
                <View style={estilosPublicacionesDirector.filaTarjeta}>
                    <MaterialIcons name="event" size={18} color={colores.primario} />
                    <Text style={estilosPublicacionesDirector.textoTarjeta}>
                        {Array.isArray(item.postulations)
                            ? item.postulations.length
                            : (postulaciones[item._id]?.length || 0)} postulados
                    </Text>
                </View>
                <View style={estilosPublicacionesDirector.acciones}>
                    <TouchableOpacity
                        style={estilosPublicacionesDirector.iconButton}
                        onPress={() => {
                            const postulacionesArray = Array.isArray(item.postulations)
                                ? item.postulations
                                : (Array.isArray(postulaciones[item._id]) ? postulaciones[item._id] : []);
                            navigation.navigate('postulacionesPublicacion', { postulaciones: postulacionesArray, publicacion: item });
                        }}
                        disabled={!(Array.isArray(item.postulations) ? item.postulations.length > 0 : (Array.isArray(postulaciones[item._id]) && postulaciones[item._id].length > 0))}
                    >
                        <MaterialCommunityIcons
                            name="handshake"
                            size={38}
                            color={(Array.isArray(item.postulations) && item.postulations.length > 0) ||
                                (Array.isArray(postulaciones[item._id]) && postulaciones[item._id].length > 0)
                                    ? "#117396"
                                    : "#B0BEC5"}
                            style={estilosPublicacionesDirector.iconShadow}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={estilosPublicacionesDirector.iconButton} onPress={() => {/* acción editar */ }}>
                        <MaterialCommunityIcons name="square-edit-outline" size={38} color="#117396" style={estilosPublicacionesDirector.iconShadow} />
                    </TouchableOpacity>
                    <TouchableOpacity style={estilosPublicacionesDirector.iconButton} onPress={() => {/* acción eliminar */ }}>
                        <MaterialCommunityIcons name="trash-can" size={38} color="#117396" style={estilosPublicacionesDirector.iconShadow} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    return (
        <View style={{ flex: 1 }}>
            <View style={estilosPublicacionesDirector.encabezado}>
                <View style={estilosPublicacionesDirector.filaEncabezado}>
                    <Text style={estilosPublicacionesDirector.textoEncabezado}>Escuela</Text>
                    <View style={estilosPublicacionesDirector.pickerWrapper}>
                        <Picker
                            selectedValue={escuelaSeleccionada}
                            onValueChange={(value) => setEscuelaSeleccionada(value)}
                            style={estilosPublicacionesDirector.selectEscuelasDirector}
                            dropdownIconColor="white"
                        >
                            <Picker.Item label="Seleccione escuela..." value="" />
                            {escuelas.map((escuela) => (
                                <Picker.Item
                                    key={escuela._id}
                                    label={String(escuela.schoolNumber)}
                                    value={escuela._id}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={estilosPublicacionesDirector.contenedor}>
                    <View style={estilosPublicacionesDirector.filaTitulo}>
                        <Text style={estilosPublicacionesDirector.titulo}>Publicaciones</Text>
                    </View>
                    <FlatList
                        data={datos}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        ListEmptyComponent={
                            (!loading && !refreshing) ? (
                                <View style={{ alignItems: 'center', marginTop: 32, paddingHorizontal: 24 }}>
                                    <Text style={{ textAlign: 'center', color: colores.quinto, marginBottom: 16 }}>
                                        No existen publicaciones activas para esta escuela en este momento. Intenta más tarde o prueba con otros filtros de búsqueda.
                                    </Text>
                                    <Image
                                        source={require('../../assets/sin-resultados.png')}
                                        style={{ width: 260, height: 200 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            ) : null
                        }
                        ListFooterComponent={
                            loading && !refreshing ? (
                                <View style={estilosPublicacionesDirector.spinnerCargando}>
                                    <ActivityIndicator size="large" color={colores.primario} />
                                </View>
                            ) : null
                        }
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        contentContainerStyle={{ paddingBottom: 50 }}
                    />
                </View>
            </View>
            <AppSnackbar
                visible={snackbarVisible}
                message={snackbarMessage}
                type="success"
                onDismiss={() => setSnackbarVisible(false)}
                duration={3500}
                bottomOffset={24}
            />
        </View>
    );
}

export default PublicacionesDirector