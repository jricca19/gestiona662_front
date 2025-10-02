import { StyleSheet, Dimensions } from 'react-native';
import { fuentes, colores, tamanos } from './fuentesyColores';

const { width, height } = Dimensions.get('window');

export const stylesPerfil = StyleSheet.create({
    encabezado: {
        width: '100%',
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    botonAtras: {
        marginHorizontal: width * 0.04,
    },
    contenedor: {
        flex: 1,
        backgroundColor: colores.terceario,
    },
    textoEncabezado: {
        color: colores.terceario,
        fontSize: tamanos.titulo1,
        fontWeight: 'bold',
    },
    contenidoScroll: {
        paddingTop: height * 0.025,
        paddingHorizontal: width * 0.05,
        gap: height * 0.018,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.012,
    },
    avatar: {
        width: width * 0.16,
        height: width * 0.16,
        borderRadius: width * 0.04,
        borderWidth: 2,
        borderColor: colores.secundario,
        backgroundColor: colores.secundarioClaro,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: width * 0.04,
        position: 'relative',
        overflow: 'hidden',
    },
    nombre: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        color: colores.primarioOscuro,
    },
    rol: {
        fontSize: tamanos.menu,
        color: colores.primario,
        fontWeight: '600',
    },
    tituloSeccion: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: tamanos.subtitulo,
        marginTop: height * 0.012,
        marginBottom: height * 0.008,
    },
    datosSeccion: {
        backgroundColor: colores.terceario,
        borderRadius: width * 0.025,
    },
    subtituloCampo: {
        marginTop: height * 0.01,
        fontSize: tamanos.menu,
        color: colores.primario,
        fontWeight: '600',
        marginBottom: 2,
        marginLeft: width * 0.005,
    },
    filaSeccion: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.008,
    },
    iconoFila: {
        marginRight: width * 0.02,
    },
    textoFila: {
        fontSize: tamanos.texto,
        color: colores.quinto,
    },
    textoFilaEditable: {
        fontSize: tamanos.texto,
        color: colores.quinto,
        borderRadius: width * 0.02,
        borderWidth: 1,
        borderColor: colores.tercearioOscuro,
        width: width * 0.8,
        paddingHorizontal: width * 0.02,
        backgroundColor: colores.cuarto,
    },
    contenedorBotones: {
        alignItems: 'center',
        gap: height * 0.012,
    },
    botonEditar: {
        backgroundColor: colores.primario,
        borderRadius: width * 0.02,
        paddingVertical: height * 0.013,
        alignItems: 'center',
        elevation: 2,
        width: '70%',
    },
    textoBotonEditar: {
        color: colores.terceario,
        fontSize: tamanos.texto,
    },
    escuelasContainer: {
        marginBottom: height * 0.025,
    },
    filaEscuelaInput: {
        backgroundColor: colores.terceario,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colores.tercearioOscuro,
        position: 'relative',
        minHeight: 50,
        justifyContent: 'center',
        marginBottom: height * 0.01,
    },
    tituloCalificacion: {
        fontSize: tamanos.texto,
        color: colores.primario,
    },
    botonIcono: {
        padding: width * 0.01,
    },
    filaEscuela: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.008,
    },
    codigoEscuela: {
        fontSize: tamanos.texto,
        color: colores.primarioOscuro,
        marginRight: width * 0.025,
    },
    picker: {
        height: height * 0.06,
        color: colores.quinto,
        backgroundColor: 'transparent',
    },
    filaCalificacion: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.018,
        marginLeft: width * 0.01,
    },
    textoCalificacion: {
        fontSize: tamanos.texto,
        color: colores.quinto,
        marginLeft: width * 0.01,
    },
    botonCerrarSesion: {
        alignItems: 'center',
        marginTop: height * 0.012,
        width: '70%',
    },
    textoCerrarSesion: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: tamanos.texto,
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    selectorFecha: {
        backgroundColor: colores.cuarto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colores.tercearioOscuro,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.02,
        minHeight: 50,
        width: width * 0.8,
    },
    textoFecha: {
        fontSize: tamanos.texto,
        color: colores.quinto,
    },
});
