import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { estilosDetalles } from '../styles/stylesDetallesPostulacion'
import { formatUTC } from '../../utils/formatUTC'

const shiftLabels = {
    MORNING: { label: 'Mañana', hours: '08:00 a 12:00' },
    AFTERNOON: { label: 'Tarde', hours: '13:00 a 17:00' },
    FULL: { label: 'Completo', hours: '08:00 a 16:00' },
}

const DetallesPostulacion = ({ navigation, route }) => {
    const postulacion = route.params?.postulacion || {}
    const pub = postulacion.publicationId || {}
    const escuela = pub.schoolId || {}

    let diasCubrir = ''
    if (postulacion.postulationDays && postulacion.postulationDays.length > 0) {
        const dias = postulacion.postulationDays.map(d => formatUTC(d.date, 'dd'))
        const mes = formatUTC(postulacion.postulationDays[0].date, 'MMMM - yyyy').split(' - ')[0]
        const anio = formatUTC(postulacion.postulationDays[0].date, 'MMMM - yyyy').split(' - ')[1]
        diasCubrir += `${dias.join(', ')}\n${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`
    }

    const turno = shiftLabels[pub.shift] || { label: pub.shift, hours: '' }

    const comentarioDirector = 'Ingresar por calle 123. Te recibirá la secretaria María para llevarte a tu salón.'

    return (
        <View style={estilosDetalles.contenedor}>
            <View style={estilosDetalles.encabezado}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={estilosDetalles.tituloEncabezado}>Detalles</Text>
                <View style={{ width: 28 }} />
            </View>
            <ScrollView contentContainerStyle={estilosDetalles.contenidoScroll}>
                <Text style={estilosDetalles.nombreEscuela}>Escuela N°{escuela.schoolNumber}</Text>
                <Text style={estilosDetalles.etiquetaDireccion}>Dirección</Text>
                <Text style={estilosDetalles.direccionEscuela}>
                    {escuela.address}{escuela.cityName ? `, ${escuela.cityName}` : ''}{escuela.departmentId?.name ? `, ${escuela.departmentId.name}` : ''}
                </Text>
                <View style={estilosDetalles.fila}>
                    <View style={estilosDetalles.tarjeta}>
                        <Text style={estilosDetalles.etiquetaTarjeta}>Año</Text>
                        <Text style={estilosDetalles.valorTarjeta}>{pub.grade ? `${pub.grade}°` : '-'}</Text>
                    </View>
                    <View style={estilosDetalles.tarjeta}>
                        <Text style={estilosDetalles.etiquetaTarjeta}>Turno</Text>
                        <Text style={estilosDetalles.valorTarjeta}>{turno.label}</Text>
                        {turno.hours ? <Text style={estilosDetalles.detallesTarjeta}>{turno.hours}</Text> : null}
                    </View>
                </View>
                <View style={estilosDetalles.tarjeta}>
                    <Text style={estilosDetalles.etiquetaTarjeta}>Días a Cubrir</Text>
                    <Text style={estilosDetalles.valorTarjeta}>{diasCubrir}</Text>
                </View>
                <View style={estilosDetalles.tarjeta}>
                    <Text style={estilosDetalles.etiquetaTarjeta}>Comentarios del director</Text>
                    <Text style={estilosDetalles.detallesTarjeta}>{comentarioDirector}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default DetallesPostulacion
