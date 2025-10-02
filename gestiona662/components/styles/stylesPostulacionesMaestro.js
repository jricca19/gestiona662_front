import { StyleSheet, Dimensions } from 'react-native'
import { colores, tamanos } from './fuentesyColores'

const { width, height } = Dimensions.get('window')

export const estilosPostulaciones = StyleSheet.create({
    contenedor: {
        flex: 1,
        width: '100%',
        backgroundColor: colores.terceario,
        paddingTop: 0,
    },
    encabezado: {
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
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
    tarjeta: {
        backgroundColor: colores.secundarioClaro,
        borderRadius: width * 0.04,
        padding: width * 0.03,
        marginHorizontal: width * 0.04,
        marginVertical: height * 0.01,
        elevation: 6,
    },
    encabezadoTarjeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    nombreEscuela: {
        fontSize: tamanos.subtitulo,
        fontWeight: 'bold',
        color: colores.primarioOscuro,
    },
    fechaTarjeta: {
        fontSize: tamanos.texto,
        color: colores.quinto,
        marginBottom: height * 0.01,
    },
    botonDetalles: {
        alignSelf: 'flex-start',
        backgroundColor: colores.primario,
        borderRadius: width * 0.1,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.005,
        elevation: 3,
        marginTop: height * 0.01,
    },
    textoDetalles: {
        color: colores.terceario,
        fontWeight: 'medium',
        fontSize: tamanos.menu,
    },
    estadoAceptada: {
        backgroundColor: colores.cartelExito,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.003,
        alignItems: 'center',
        justifyContent: 'center',
    },
    estadoPendiente: {
        backgroundColor: colores.cartelAdvertencia,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.003,
        alignItems: 'center',
        justifyContent: 'center',
    },
    estadoFinalizada: {
        backgroundColor: colores.terceario,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.003,
        alignItems: 'center',
        justifyContent: 'center',
    },
    estadoRechazada: {
        backgroundColor: colores.cartelError,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.003,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoEstado: {
        fontWeight: 'bold',
        fontSize: tamanos.texto,
    },
    error: {
        marginTop: height * 0.2,
        textAlign: 'center',
        fontSize: tamanos.texto,
        color: 'red',
    },
    botonReintentar: {
        backgroundColor: colores.primario,
        borderRadius: width * 0.03,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.06,
        elevation: 10,
        marginTop: height * 0.02,
    },
    textoBotonReintentar: {
        color: colores.terceario,
        fontWeight: 'bold',
        fontSize: tamanos.texto,
    },
    spinnerCargando: {
        marginTop: height * 0.01,
        alignItems: 'center',
    },
    textoFinalLista: {
        marginTop: height * 0.01,
        alignItems: 'center',
        fontSize: tamanos.textoMayor,
        color: colores.primario,
        textAlign: 'center',
    },
    sinPostulaciones: {
        alignItems: 'center',
        marginTop: height * 0.2,
    },
    sinPostulacionesImagen: {
        width: width,
        height: height * 0.3,
        marginTop: height * 0.05,
        opacity: 0.7,
    },
})
