import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { estilosPostulacionExitosa } from '../styles/PostulacionExitosa'
import BotonPulsaciones from '../BotonPulsaciones'

const PostulacionExitosa = ({ route, navigation }) => {
    const { postulation, detalles, diasSeleccionadosTexto } = route.params

    const escuela = detalles?.escuela || 'No disponible'
    const clase = detalles?.clase || 'No disponible'
    const turno = detalles?.turno || 'No disponible'

    let dias = []
    if (diasSeleccionadosTexto) {
        dias = diasSeleccionadosTexto
    }

    return (
        <View style={estilosPostulacionExitosa.contenedor}>
            <View style={estilosPostulacionExitosa.encabezado}>
                <Text style={estilosPostulacionExitosa.tituloEncabezado}>Postulación Exitosa</Text>
            </View>
            <View style={estilosPostulacionExitosa.iconoContainer}>
                <Ionicons name="checkmark-circle" size={64} color="#009BDB" />
            </View>
            <Text style={estilosPostulacionExitosa.titulo1}>
                Tu postulación fué realizada correctamente
            </Text>
            <Text style={estilosPostulacionExitosa.titulo1}>
                Te comunicaremos el resultado de la selección
            </Text>
            <Text style={estilosPostulacionExitosa.titulo2}>Detalles de la postulación</Text>
            <Text style={estilosPostulacionExitosa.detalle}>
                {escuela ? `Escuela Nº${escuela.schoolNumber}` : ''}
            </Text>
            <Text style={estilosPostulacionExitosa.detalle}>
                {escuela ? `Dirección ${escuela.address}${escuela.cityName ? ', ' + escuela.cityName : ''}${escuela.departmentId?.name ? ', ' + escuela.departmentId.name : ''}` : ''}
            </Text>
            <Text style={estilosPostulacionExitosa.detalle}>
                {clase ? `Clase ${clase}° - Turno ${turno}` : ''}
            </Text>
            <Text style={estilosPostulacionExitosa.titulo2}>Días de tu postulación</Text>
            {dias.map((d, idx) => (
                <Text key={idx} style={estilosPostulacionExitosa.detalle}>
                    {d}
                </Text>
            ))}
            <Text style={[estilosPostulacionExitosa.detalle, { marginTop: 20, fontWeight: 'bold' }]}>
                Tienes tiempo de cancelar antes de ser seleccionado.
            </Text>

            <BotonPulsaciones
                onPress={() => navigation.replace('maestroTabs', { screen: 'misPostulaciones', params: { refresh: true } })}
                loading={false}
                pulse={true}
                text="Ver Postulaciones"
                loadingText="Ver Postulaciones"
            />
        </View>
    )
}

export default PostulacionExitosa
