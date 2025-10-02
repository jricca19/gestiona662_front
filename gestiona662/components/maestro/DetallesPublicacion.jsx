import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { estilosDetalles } from '../styles/stylesDetallesPublicacion'
import { formatUTC } from '../../utils/formatUTC'
import * as SecureStore from 'expo-secure-store'
import { URL_BACKEND } from '@env';
import { Snackbar } from 'react-native-paper';
import { colores } from '../styles/fuentesyColores'
import BotonPulsaciones from '../BotonPulsaciones';

const { height } = Dimensions.get('window')

const DetallesPublicacion = ({ route, navigation }) => {
    const { publicacion } = route.params

    const fechas = (publicacion.publicationDays || [])
        .filter(d => d.status === 'AVAILABLE')
        .map(d => ({
            label: formatUTC(d.date, 'EEEE dd'),
            value: d.date
        }))

    const [seleccionados, setSeleccionados] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const toggleCheckbox = (value) => {
        setSeleccionados(prev => ({
            ...prev,
            [value]: !prev[value]
        }))
    }

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const handlePostularse = async () => {
        setError(null)
        const seleccionadosArray = Object.keys(seleccionados).filter(k => seleccionados[k])
        if (seleccionadosArray.length === 0) {
            setError('Debe seleccionar al menos un día para postularse.')
            return
        }
        setLoading(true)
        try {
            const token = await SecureStore.getItemAsync('token')
            const appliesToAllDays = seleccionadosArray.length === fechas.length
            const body = {
                publicationId: publicacion._id,
                createdAt: new Date().toISOString(),
                appliesToAllDays,
                ...(appliesToAllDays ? {} : {
                    postulationDays: seleccionadosArray.map(date => ({
                        date: date.split('T')[0]
                    }))
                })
            }
            const res = await fetch(`${URL_BACKEND}/v1/postulations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if (res.status === 201) {
                const detalles = {
                    escuela: publicacion.schoolId,
                    clase: publicacion.grade + (publicacion.division || ''),
                    turno: publicacion.shift === 'MORNING'
                        ? 'matutino'
                        : publicacion.shift === 'AFTERNOON'
                            ? 'vespertino'
                            : publicacion.shift === 'FULL'
                                ? 'completo'
                                : publicacion.shift
                }

                const diasSeleccionadosTexto = appliesToAllDays
                    ? (publicacion.publicationDays || []).map(d => formatUTC(d.date, 'dd/MM/yyyy'))
                    : seleccionadosArray.map(date => formatUTC(date, 'dd/MM/yyyy'))

                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'postulacionExitosa',
                            params: {
                                postulation: data,
                                detalles,
                                diasSeleccionadosTexto
                            }
                        }
                    ]
                })
            } else {
                showSnackbar(data.error || 'Error al postularse');
            }
        } catch (e) {
            showSnackbar('Error de red o servidor');
        }
        setLoading(false)
    }

    return (
        <>
            <View style={estilosDetalles.contenedor}>
                <View style={estilosDetalles.encabezado}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={estilosDetalles.tituloEncabezado}>Publicación</Text>
                    <View style={{ width: 28 }} />
                </View>
                <ScrollView contentContainerStyle={estilosDetalles.contenidoScroll}>
                    <Text style={estilosDetalles.nombreEscuela}>
                        Escuela {publicacion.schoolId?.schoolNumber}
                    </Text>
                    <Text style={estilosDetalles.tituloSeccion}>Dirección</Text>
                    <Text style={estilosDetalles.direccion}>
                        {publicacion.schoolId?.address}
                    </Text>
                    <View style={estilosDetalles.fila}>
                        <View style={estilosDetalles.tarjeta}>
                            <Text style={estilosDetalles.etiquetaTarjeta}>Año</Text>
                            <Text style={estilosDetalles.valorTarjeta}>{publicacion.grade}{publicacion.division ? publicacion.division : ''}</Text>
                        </View>
                        <View style={estilosDetalles.tarjeta}>
                            <Text style={estilosDetalles.etiquetaTarjeta}>Turno</Text>
                            <Text style={estilosDetalles.valorTarjeta}>
                                {publicacion.shift === 'MORNING' ? 'Mañana' : publicacion.shift === 'AFTERNOON' ? 'Tarde' : publicacion.shift === 'FULL' ? 'Completo' : publicacion.shift}
                            </Text>
                            <Text style={estilosDetalles.subValorTarjeta}>
                                {publicacion.shift === 'MORNING' && '08:00 a 12:00'}
                                {publicacion.shift === 'AFTERNOON' && '12:00 a 17:00'}
                                {publicacion.shift === 'FULL' && '08:00 a 16:00'}
                            </Text>
                        </View>
                    </View>
                    {fechas.length > 0 && (
                        <View style={estilosDetalles.tarjetaFechas}>
                            <Text style={estilosDetalles.etiquetaTarjeta}>Selección de días</Text>
                            <Text style={estilosDetalles.tituloMes}>
                                {formatUTC(fechas[0].value, 'MMMM - yyyy')}
                            </Text>
                            {fechas.map(f => (
                                <View key={f.value} style={estilosDetalles.filaDia}>
                                    <TouchableOpacity
                                        onPress={() => toggleCheckbox(f.value)}
                                    >
                                        {seleccionados[f.value] ? (
                                            <Ionicons name="checkbox" size={35} color="#009BDB" />
                                        ) : (
                                            <Ionicons name="square-outline" size={35} color="#B4B4B4" />
                                        )}
                                    </TouchableOpacity>
                                    <Text style={estilosDetalles.etiquetaDia}>
                                        {f.label.charAt(0).toUpperCase() + f.label.slice(1)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                    <BotonPulsaciones
                        onPress={handlePostularse}
                        loading={loading}
                        text="Postularse"
                        loadingText="Enviando..."
                    />
                    {error && (
                        <Text style={{ color: 'red', marginVertical: 10, textAlign: 'center' }}>{error}</Text>
                    )}
                </ScrollView>
            </View>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={4000}
                style={{
                    backgroundColor: colores.cartelError,
                    marginBottom: height * 0.1,
                }}
            >
                <Text style={{
                    color: colores.letrasError,
                    fontWeight: 'bold'
                }}>
                    {snackbarMessage}
                </Text>
            </Snackbar>
        </>
    )
}

export default DetallesPublicacion
