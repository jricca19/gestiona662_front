import { FlatList, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Ionicons } from '@expo/vector-icons'
import { estilosPostulaciones } from '../styles/stylesPostulacionesMaestro'
import { colores } from '../styles/fuentesyColores'
import { formatUTC } from '../../utils/formatUTC'
import { URL_BACKEND } from '@env';
import EfectoSlide from '../EfectoSlide';
import DeslizarParaEliminar from '../DeslizarParaEliminar';
import { useDispatch, useSelector } from 'react-redux'
import { establecerPostulaciones, eliminarPostulacion } from '../../store/slices/postulacionesSlice'

const estados = {
    ACCEPTED: {
        label: 'Aceptada',
        style: estilosPostulaciones.estadoAceptada,
        color: colores.letrasExito
    },
    PENDING: {
        label: 'Pendiente',
        style: estilosPostulaciones.estadoPendiente,
        color: colores.letrasAdvertencia
    },
    FINALIZED: {
        label: 'Finalizada',
        style: estilosPostulaciones.estadoFinalizada,
        color: colores.tercearioOscuro
    },
    REJECTED: {
        label: 'Rechazada',
        style: estilosPostulaciones.estadoRechazada,
        color: colores.letrasError
    },
}

const statusOrder = {
    ACCEPTED: 0,
    PENDING: 1,
    REJECTED: 2,
    FINALIZED: 3,
}

const PostulacionesMaestro = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const datos = useSelector(state => state.postulaciones.items);
    const lastUpdate = useSelector(state => state.postulaciones.lastUpdate);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [refreshing, setRefreshing] = useState(false)

    const fetchPostulaciones = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = await SecureStore.getItemAsync('token')
            const res = await fetch(`${URL_BACKEND}/v1/postulations/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const data = await res.json()
            if (res.status === 200) {
                dispatch(establecerPostulaciones(data))
            } else {
                setError('Error al obtener postulaciones')
            }
        } catch (err) {
            setError('Error de red o servidor')
        }
        setLoading(false)
    }

    useEffect(() => {
        if (lastUpdate === 0) {
            fetchPostulaciones()
        }
    }, [lastUpdate]);

    useEffect(() => {
        if (route?.params?.refresh) {
            fetchPostulaciones();
            navigation.setParams({ refresh: false });
        }
    }, [route?.params?.refresh]);

    const handleRefresh = () => {
        setRefreshing(true)
        fetchPostulaciones().then(() => setRefreshing(false))
    }

    const eliminarPostulacionHandler = async (id) => {
        dispatch(eliminarPostulacion(id));
        setError(null);
        try {
            const token = await SecureStore.getItemAsync('token')
            const res = await fetch(`${URL_BACKEND}/v1/postulations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (res.status !== 200) {
                setError('Error al eliminar la postulación');
                fetchPostulaciones();
            }
        } catch (err) {
            setError('Error de red o servidor');
            fetchPostulaciones();
        }
    };

    const renderItem = ({ item }) => {
        let fechas = ''
        if (item.postulationDays && item.postulationDays.length > 0) {
            const dias = item.postulationDays.map(d =>
                formatUTC(d.date, 'dd')
            )
            const mes = formatUTC(item.postulationDays[0].date, 'MMMM - yyyy').split(' - ')[0]
            const anio = formatUTC(item.postulationDays[0].date, 'MMMM - yyyy').split(' - ')[1]
            fechas = `${dias.join(', ')} de ${mes} de ${anio}`
        }

        const estado = estados[item.status] || { label: item.status, style: estilosPostulaciones.estadoPendiente, color: colores.quinto }
        const pub = item.publicationId || {}
        const escuela = pub.schoolId || {}

        const puedeEliminar = item.status === 'PENDING';

        return (
            puedeEliminar ? (
                <DeslizarParaEliminar
                    onDelete={() => eliminarPostulacionHandler(item._id)}
                    confirmMessage="¿Seguro que desea eliminar esta postulación?"
                >
                    <EfectoSlide style={estilosPostulaciones.tarjeta}>
                        <View key={item._id}>
                            <View style={estilosPostulaciones.encabezadoTarjeta}>
                                <Text style={estilosPostulaciones.nombreEscuela}>
                                    Escuela N°{escuela.schoolNumber}
                                </Text>
                                <View style={estado.style}>
                                    <Text style={[estilosPostulaciones.textoEstado, { color: estado.color }]}>{estado.label}</Text>
                                </View>
                            </View>
                            <Text style={estilosPostulaciones.fechaTarjeta}>
                                {pub.grade ? `${pub.grade}° - ` : ''}
                                {pub.shift === 'MORNING' ? 'Mañana' : pub.shift === 'AFTERNOON' ? 'Tarde' : pub.shift === 'FULL' ? 'Tiempo Completo' : pub.shift}
                            </Text>
                            <Text style={estilosPostulaciones.fechaTarjeta}>{fechas}</Text>
                            <TouchableOpacity
                                style={estilosPostulaciones.botonDetalles}
                                onPress={() => navigation.navigate('detallesPostulacion', { postulacion: item })}
                            >
                                <Text style={estilosPostulaciones.textoDetalles}>Ver Detalles</Text>
                            </TouchableOpacity>
                        </View>
                    </EfectoSlide>
                </DeslizarParaEliminar>
            ) : (
                <EfectoSlide style={estilosPostulaciones.tarjeta}>
                    <View key={item._id}>
                        <View style={estilosPostulaciones.encabezadoTarjeta}>
                            <Text style={estilosPostulaciones.nombreEscuela}>
                                Escuela N°{escuela.schoolNumber}
                            </Text>
                            <View style={estado.style}>
                                <Text style={[estilosPostulaciones.textoEstado, { color: estado.color }]}>{estado.label}</Text>
                            </View>
                        </View>
                        <Text style={estilosPostulaciones.fechaTarjeta}>
                            {pub.grade ? `${pub.grade}° - ` : ''}
                            {pub.shift === 'MORNING' ? 'Mañana' : pub.shift === 'AFTERNOON' ? 'Tarde' : pub.shift === 'FULL' ? 'Tiempo Completo' : pub.shift}
                        </Text>
                        <Text style={estilosPostulaciones.fechaTarjeta}>{fechas}</Text>
                        <TouchableOpacity
                            style={estilosPostulaciones.botonDetalles}
                            onPress={() => navigation.navigate('detallesPostulacion', { postulacion: item })}
                        >
                            <Text style={estilosPostulaciones.textoDetalles}>Ver Detalles</Text>
                        </TouchableOpacity>
                    </View>
                </EfectoSlide>
            )
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={estilosPostulaciones.encabezado}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={estilosPostulaciones.tituloEncabezado}>Postulaciones</Text>
                <View style={{ width: 28 }} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={estilosPostulaciones.contenedor}>
                    {error ? (
                        <View style={{ alignItems: 'center', marginTop: 32 }}>
                            <Text style={estilosPostulaciones.error}>{error}</Text>
                            <TouchableOpacity
                                style={estilosPostulaciones.botonReintentar}
                                onPress={() => {
                                    setError(null)
                                    fetchPostulaciones()
                                }}
                            >
                                <Text style={estilosPostulaciones.textoBotonReintentar}>Reintentar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : loading ? (
                        <View style={estilosPostulaciones.spinnerCargando}>
                            <ActivityIndicator size="large" color="#0099e6" />
                        </View>
                    ) : (
                        <FlatList
                            data={[...datos].sort((a, b) =>
                                (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
                            )}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                            ListEmptyComponent={
                                <View style={estilosPostulaciones.sinPostulaciones}>
                                    <Text style={estilosPostulaciones.textoFinalLista}>
                                        No tienes postulaciones en este momento.
                                    </Text>
                                    <Image
                                        source={require('../../assets/sin-resultados.png')}
                                        style={estilosPostulaciones.sinPostulacionesImagen}
                                        resizeMode="contain"
                                    />
                                </View>
                            }
                            ListFooterComponent={
                                datos.length > 0 ? (
                                    <Text style={estilosPostulaciones.textoFinalLista}>
                                        No hay más postulaciones para mostrar
                                    </Text>
                                ) : null
                            }
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            contentContainerStyle={{ paddingBottom: 50 }}
                        />
                    )}
                </View>
            </View>
        </View>
    )
}

export default PostulacionesMaestro