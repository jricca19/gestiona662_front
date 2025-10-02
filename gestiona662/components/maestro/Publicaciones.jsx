import { FlatList, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import * as SecureStore from 'expo-secure-store';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'
import { colores } from '../styles/fuentesyColores'
import { estilosPublicaciones } from '../styles/stylesPublicaciones'
import ModalBusquedaPublicaciones from './ModalBusquedaPublicaciones'
import { formatUTC } from '../../utils/formatUTC'
import { URL_BACKEND } from '@env';
import { useDispatch } from 'react-redux';
import { establecerTotalPublicaciones } from '../../store/slices/publicacionesSlice';

const PAGE_SIZE = 4;

const Publicaciones = ({ navigation }) => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filtrosActivos, setFiltrosActivos] = useState(null);
    const dispatch = useDispatch();

    const fetchPublicaciones = useCallback(async (pageToLoad = 1, refreshing = false, filtros = undefined) => {
        if (loading) return;
        if (!refreshing && total && datos.length >= total) return;
        setLoading(true);
        setError(null);
        try {
            const token = await SecureStore.getItemAsync('token');

            let url = `${URL_BACKEND}/v1/publications?page=${pageToLoad}&limit=${PAGE_SIZE}`;

            let filtrosAUsar;
            if (filtros !== undefined) {
                filtrosAUsar = filtros;
            } else {
                filtrosAUsar = filtrosActivos;
            }

            if (filtrosAUsar) {
                if (filtrosAUsar.departmentName) {
                    url += `&departmentName=${filtrosAUsar.departmentName}`;
                }
                if (filtrosAUsar.schoolId) {
                    url += `&schoolId=${filtrosAUsar.schoolId}`;
                }
                if (filtrosAUsar.startDate) {
                    url += `&startDate=${filtrosAUsar.startDate}`;
                }
            }

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setTotal(data.total);
                if (refreshing) {
                    setDatos(data.publications);
                } else {
                    setDatos(prev => [...prev, ...data.publications]);
                }
                if (pageToLoad === 1 && !filtros) {
                    dispatch(establecerTotalPublicaciones(data.total));
                }
            } else {
                setError('Error al obtener publicaciones', data.message);
            }
        } catch (err) {
            setError('Error de red o servidor');
        }
        setLoading(false);
    }, [loading, datos.length, total, filtrosActivos]);

    useEffect(() => {
        fetchPublicaciones(1, true);
        setPage(1);
    }, []);

    const handleLoadMore = () => {
        if (loading) return;
        if (datos.length >= total) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPublicaciones(nextPage, false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchPublicaciones(1, true).then(() => setRefreshing(false));
    };

    const handleApplyFilters = (filtros) => {
        setFiltrosActivos(filtros);
        setError(null);
        setPage(1);
        setDatos([]);
        setTotal(0);
        fetchPublicaciones(1, true, filtros);
    };

    const handleClearFilters = () => {
        setFiltrosActivos(null);
        setError(null);
        setPage(1);
        setDatos([]);
        setTotal(0);
        fetchPublicaciones(1, true, null);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const renderItem = ({ item }) => {
        let fechaFormateada = '';
        if (item.startDate && item.endDate) {
            fechaFormateada =
                formatUTC(item.startDate, 'dd') +
                '-' +
                formatUTC(item.endDate, 'dd MMM yyyy');
        }

        return (
            <View style={estilosPublicaciones.tarjeta} key={item._id}>
                <View style={estilosPublicaciones.encabezadoTarjeta}>
                    <Text style={estilosPublicaciones.nombreEscuela}>Escuela Nº{item.schoolId?.schoolNumber}</Text>
                    <View style={estilosPublicaciones.calificacion}>
                        <FontAwesome name="star" size={20} color="#FFD700" />
                        <Text style={estilosPublicaciones.textoCalificacion}>{item.rating ?? '0'}</Text>
                    </View>
                </View>
                <View style={estilosPublicaciones.filaTarjeta}>
                    <MaterialIcons name="access-time" size={18} color={colores.primario} />
                    <Text style={estilosPublicaciones.textoTarjeta}>
                        {item.grade}° -
                        {item.shift === 'MORNING' ? ' Mañana - ' : item.shift === 'AFTERNOON' ? ' Tarde - ' : item.shift === 'FULL' ? ' Tiempo Completo - ' : ` ${item.shift}`}
                        {item.shift === 'MORNING' && '08:00 a 12:00'}
                        {item.shift === 'AFTERNOON' && '12:00 a 17:00'}
                        {item.shift === 'FULL' && '09:00 a 15:00'}
                    </Text>
                </View>
                <View style={estilosPublicaciones.filaTarjeta}>
                    <MaterialIcons name="event" size={18} color={colores.primario} />
                    <Text style={estilosPublicaciones.textoTarjeta}>
                        {fechaFormateada}
                    </Text>
                </View>
                <View style={[estilosPublicaciones.filaTarjeta, { justifyContent: 'space-between' }]}>
                    <MaterialIcons name="place" size={18} color={colores.primario} />
                    <View style={{ flex: 1 }}>
                        <Text style={estilosPublicaciones.textoTarjeta}>
                            {item.schoolId?.departmentId?.name || 'Sin Departamento'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={estilosPublicaciones.botonDetalles}
                        onPress={() => navigation.navigate('detallesPublicacion', { publicacion: item })}
                    >
                        <Ionicons name="eye-outline" size={18} color="#fff" />
                        <Text style={estilosPublicaciones.textoDetalles}>Ver Detalles</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={estilosPublicaciones.encabezado}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={estilosPublicaciones.tituloEncabezado}>Búsqueda</Text>
                <View style={{ width: 28 }} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={estilosPublicaciones.contenedor}>
                    <View style={estilosPublicaciones.fila}>
                        <Text style={estilosPublicaciones.titulo}>Publicaciones</Text>
                        <TouchableOpacity
                            style={estilosPublicaciones.botonFiltrar}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={estilosPublicaciones.textoFiltrar}>Filtrar</Text>
                        </TouchableOpacity>
                    </View>
                    {error ? (
                        <View style={{ alignItems: 'center', marginTop: 32 }}>
                            <Text style={estilosPublicaciones.error}>{error}</Text>
                            <TouchableOpacity
                                style={[estilosPublicaciones.botonReintentar, { marginTop: 16 }]}
                                onPress={() => {
                                    setError(null);
                                    fetchPublicaciones(1, true);
                                    setPage(1);
                                }}
                            >
                                <Text style={estilosPublicaciones.textoBotonReintentar}>Reintentar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={datos}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListEmptyComponent={
                                (!loading && !refreshing) ? (
                                    <View style={estilosPublicaciones.sinPublicaciones}>
                                        <Text style={estilosPublicaciones.textoFinalLista}>
                                            No existen publicaciones activas en este momento. Intenta mas tarde o prueba con otros filtros de búsqueda.
                                        </Text>
                                        <Image
                                            source={require('../../assets/sin-resultados.png')}
                                            style={estilosPublicaciones.sinPublicacionesImagen}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : null
                            }
                            ListFooterComponent={
                                loading && !refreshing ? (
                                    <View style={estilosPublicaciones.spinnerCargando}>
                                        <ActivityIndicator size="large" color={colores.primario} />
                                    </View>
                                ) : datos.length >= total && total > 0 ? (
                                    <View style={estilosPublicaciones.spinnerCargando}>
                                        <Text style={estilosPublicaciones.textoFinalLista}>No hay más publicaciones para mostrar</Text>
                                    </View>
                                ) : null
                            }
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            contentContainerStyle={{ paddingBottom: 50 }}
                        />
                    )}
                </View>
            </View>

            <ModalBusquedaPublicaciones
                visible={modalVisible}
                onClose={handleCloseModal}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
        </View>
    )
}

export default Publicaciones