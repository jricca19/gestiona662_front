import { StyleSheet, Dimensions } from 'react-native'
import { colores, tamanos } from './fuentesyColores'

const { width, height } = Dimensions.get('window')

export const estilosDetalles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: colores.terceario,
    },
    encabezado: {
        backgroundColor: colores.primario,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tituloEncabezado: {
        color: colores.terceario,
        fontSize: tamanos.titulo1,
        fontWeight: 'bold',
    },
    contenidoScroll: {
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
    },
    nombreEscuela: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        color: colores.primarioOscuro,
        marginTop: height * 0.01,
        marginBottom: height * 0.005,
        textAlign: 'center',
    },
    etiquetaDireccion: {
        fontWeight: 'bold',
        color: colores.primarioOscuro,
        fontSize: tamanos.menu,
        marginTop: height * 0.01,
        textAlign: 'center',
    },
    direccionEscuela: {
        color: colores.quinto,
        fontSize: tamanos.texto,
        marginBottom: height * 0.02,
        textAlign: 'center',
    },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    tarjeta: {
        flex: 1,
        backgroundColor: '#eaf6ff',
        borderRadius: width * 0.04,
        marginHorizontal: width * 0.02,
        marginVertical: height * 0.02,
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.04,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    etiquetaTarjeta: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: tamanos.menu,
        marginBottom: height * 0.005,
    },
    valorTarjeta: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        color: colores.quinto,
        textAlign: 'center',
    },
    detallesTarjeta: {
        fontSize: tamanos.texto,
        color: colores.quinto,
        marginTop: 2,
    },
})
