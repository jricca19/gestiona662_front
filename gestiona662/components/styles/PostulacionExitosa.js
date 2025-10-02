import { StyleSheet, Dimensions } from 'react-native'
import { colores, tamanos } from './fuentesyColores'
const { width, height } = Dimensions.get('window')

export const estilosPostulacionExitosa = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: colores.terceario,
        alignItems: 'center',
        paddingTop: 0,
    },
    encabezado: {
        width: '100%',
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.04,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tituloEncabezado: {
        color: colores.terceario,
        fontSize: tamanos.titulo1,
        fontWeight: 'bold',
    },
    iconoContainer: {
        marginVertical: height * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo1: {
        fontSize: tamanos.subtitulo,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.05,
        marginHorizontal: width * 0.04,
        color: colores.quinto,
    },
    titulo2: {
        fontSize: tamanos.subtitulo,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: height * 0.02,
        marginHorizontal: width * 0.04,
        color: colores.quinto,
    },
    detalle: {
        fontSize: tamanos.texto,
        textAlign: 'center',
        marginBottom: height * 0.01,
        color: colores.quinto,
    },
})
