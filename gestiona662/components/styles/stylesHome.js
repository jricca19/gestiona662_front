import { StyleSheet, Dimensions } from 'react-native';
import { fuentes, colores, tamanos } from './fuentesyColores'

const { width, height } = Dimensions.get('window');

export const estilosHome = StyleSheet.create({
    encabezado: {
        width: '100%',
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
        alignItems: 'center',
    },
    textoEncabezado: {
        color: colores.terceario,
        fontSize: tamanos.titulo1,
        fontWeight: 'bold',
    },
    contenedor: {
        flex: 1,
        backgroundColor: colores.terceario,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bienvenida: {
        padding: height * 0.025,
    },
    bienvenidaContenido: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tituloSeccion: {
        textAlign: 'center',
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: tamanos.subtitulo,
        marginTop: height * 0.012,
        marginBottom: height * 0.008,
    },
    escuelasContainer: {
        marginBottom: height * 0.025,
    },
    filaEscuelaInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        position: 'relative',
        minHeight: 50,
        width: width * 0.7,
        justifyContent: 'center',
    },
    picker: {
        height: height * 0.06,
        color: colores.quinto,
        backgroundColor: 'transparent',
    },
    contenedorIndicadores: {
        marginTop: height * 0.03,
        width: '100%',
        alignItems: 'center',
        marginTop: height * 0.05,
    },
    filaIndicadores: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: height * 0.012,
        gap: width * 0.15,
    },
    indicadorYEtiqueta: {
        marginVertical: height * 0.012,
        alignItems: 'center',
        width: width * 0.25,
    },
    indicador: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colores.terceario,
        width: width * 0.25,
        height: width * 0.25,
    },
    numeroIndicador: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: tamanos.subtitulo,
    },
    etiquetaIndicador: {
        textAlign: 'center',
        color: colores.primarioOscuro,
        fontWeight: '500',
        fontSize: tamanos.menu,
    },
    btnNotificaciones: {
        backgroundColor: colores.terceario,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.08,
        borderRadius: 8,
        marginTop: 40,
        elevation: 0,
        shadowColor: 'transparent',
    },
    textoBtnNotificaciones: {
        color: colores.terceario,
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
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

});
