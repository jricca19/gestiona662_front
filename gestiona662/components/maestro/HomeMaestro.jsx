import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { estilosHome } from '../styles/stylesHome';
import { establecerPostulaciones } from '../../store/slices/postulacionesSlice';
import { establecerTotalPublicaciones } from '../../store/slices/publicacionesSlice';
import { URL_BACKEND } from '@env';

const HomeMaestro = ({ navigation }) => {
    const { name, lastName, logueado } = useSelector(state => state.usuario);
    const postulaciones = useSelector(state => state.postulaciones.items);
    const publicacionesTotal = useSelector(state => state.publicaciones?.total ?? 0);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const res = await fetch(`${URL_BACKEND}/v1/postulations/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await res.json();
                if (res.status === 200) {
                    dispatch(establecerPostulaciones(data));
                    setError(null);
                } else {
                    setError('Error al obtener postulaciones');
                }
            } catch (err) {
                setError('Error de red o servidor');
            }
        };
        if (logueado && postulaciones.length === 0) {
            fetchPostulaciones();
        }
    }, [logueado, postulaciones.length]);

    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const res = await fetch(`${URL_BACKEND}/v1/publications?page=1&limit=1`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await res.json();
                if (res.status === 200) {
                    dispatch(establecerTotalPublicaciones(data.total));
                }
            } catch (err) {
                setError('Error de red o servidor');
            }
        };
        if (logueado && publicacionesTotal === 0) {
            fetchPublicaciones();
        }
    }, [logueado, publicacionesTotal]);

    const enCurso = postulaciones.filter(p => p.status === 'PENDING').length;
    const aceptadas = postulaciones.filter(p => p.status === 'ACCEPTED').length;
    const concretadas = postulaciones.filter(p => p.status === 'FINALIZED').length;

    return (
        <View style={{ flex: 1 }}>
            <View style={estilosHome.encabezado}>
                <Text style={estilosHome.textoEncabezado}>Gestiona 662</Text>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
                <View style={estilosHome.contenedor}>
                    {error ? (
                        <View style={{ alignItems: 'center', marginTop: 32 }}>
                            <Text style={estilosHome.error}>{error}</Text>
                            <TouchableOpacity
                                style={estilosHome.botonReintentar}
                                onPress={() => {
                                    setError(null);
                                    const fetchPostulaciones = async () => {
                                        try {
                                            const token = await SecureStore.getItemAsync('token');
                                            const res = await fetch(`${URL_BACKEND}/v1/postulations/user`, {
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                },
                                            });
                                            const data = await res.json();
                                            if (res.status === 200) {
                                                dispatch(establecerPostulaciones(data));
                                                setError(null);
                                            } else {
                                                setError('Error al obtener postulaciones');
                                            }
                                        } catch (err) {
                                            setError('Error de red o servidor');
                                        }
                                    };
                                    fetchPostulaciones();
                                }}
                            >
                                <Text style={estilosHome.textoBotonReintentar}>Reintentar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <View>
                                <View style={estilosHome.bienvenida}>
                                    <Text style={estilosHome.bienvenidaContenido}>Bienvenid@</Text>
                                    <Text style={estilosHome.bienvenidaContenido}>{`${name} ${lastName}`}</Text>
                                </View>
                            </View>
                            <View style={estilosHome.contenedorIndicadores}>
                                <View style={estilosHome.filaIndicadores}>
                                    <View style={estilosHome.indicadorYEtiqueta}>
                                        <View style={estilosHome.indicador}>
                                            <MaterialIcons name="event-note" size={40} color="#009fe3" />
                                            <Text style={estilosHome.numeroIndicador}>{enCurso}</Text>
                                        </View>
                                        <Text style={estilosHome.etiquetaIndicador}>Postulaciones{"\n"}en Curso</Text>
                                    </View>
                                    <View style={estilosHome.indicadorYEtiqueta}>
                                        <View style={estilosHome.indicador}>
                                            <MaterialIcons name="warning" size={40} color="#009fe3" />
                                            <Text style={estilosHome.numeroIndicador}>{publicacionesTotal}</Text>
                                        </View>
                                        <Text style={estilosHome.etiquetaIndicador}>Publicaciones{"\n"}Abiertas</Text>
                                    </View>
                                </View>
                                <View style={estilosHome.filaIndicadores}>
                                    <View style={estilosHome.indicadorYEtiqueta}>
                                        <View style={estilosHome.indicador}>
                                            <MaterialIcons name="work" size={40} color="#009fe3" />
                                            <Text style={estilosHome.numeroIndicador}>{aceptadas}</Text>
                                        </View>
                                        <Text style={estilosHome.etiquetaIndicador}>Aceptadas</Text>
                                    </View>
                                    <View style={estilosHome.indicadorYEtiqueta}>
                                        <View style={estilosHome.indicador}>
                                            <MaterialIcons name="verified" size={40} color="#009fe3" />
                                            <Text style={estilosHome.numeroIndicador}>{concretadas}</Text>
                                        </View>
                                        <Text style={estilosHome.etiquetaIndicador}>Concretadas</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={estilosHome.btnNotificaciones}
                                onPress={() => navigation.navigate('notificacionesPush')}
                                activeOpacity={0.7}
                            >
                                <Text style={estilosHome.textoBtnNotificaciones}>
                                    Probar Notificaciones Push
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeMaestro;
