import { StyleSheet, Dimensions } from 'react-native'
import { colores, tamanos } from './fuentesyColores'
import { he } from 'date-fns/locale';

const { width, height } = Dimensions.get('window');

export const estilosPublicaciones = StyleSheet.create({
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
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
        elevation: 6,
        backgroundColor: colores.terceario,
        borderBottomWidth: 1,
        borderColor: colores.tercearioOscuro,
    },
    titulo: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        color: colores.quinto,
    },
    botonFiltrar: {
        backgroundColor: colores.primario,
        borderRadius: width * 0.03,
        paddingVertical: height * 0.005,
        paddingHorizontal: width * 0.04,
        elevation: 6,
    },
    textoFiltrar: {
        color: colores.terceario,
        fontWeight: 'bold',
        fontSize: tamanos.texto,
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
    },
    nombreEscuela: {
        fontSize: tamanos.subtitulo,
        fontWeight: 'bold',
        color: colores.primarioOscuro,
    },
    calificacion: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.01,
    },
    textoCalificacion: {
        marginLeft: width * 0.01,
        fontWeight: 'bold',
        color: colores.quinto,
        fontSize: tamanos.texto,
    },
    filaTarjeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: height * 0.005,
    },
    textoTarjeta: {
        marginHorizontal: width * 0.02,
        fontSize: tamanos.texto,
        color: colores.quinto,
    },
    botonDetalles: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: colores.primario,
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.005,
        elevation: 6,
    },
    textoDetalles: {
        color: colores.terceario,
        fontWeight: 'bold',
        marginLeft: width * 0.03,
        fontSize: tamanos.menu,
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
        fontSize: tamanos.textoMayor,
        color: colores.primario,
        textAlign: 'center',
    },
    selectEscuelasDirector: {
        color: 'white',
        width: '100%',
        fontSize: 16,
    },

    pickerWrapper: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        overflow: 'hidden',
        width: width * 0.35,
        height: height * 0.05,
        justifyContent: 'center',
    },
    sinPublicaciones: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.01,
        paddingVertical: height * 0.1,
    },
    sinPublicacionesImagen: {
        width: width,
        height: height * 0.3,
        marginTop: height * 0.05,
        opacity: 0.7,
    }
});
