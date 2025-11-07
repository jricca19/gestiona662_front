import { StyleSheet, Dimensions } from 'react-native'
import { colores, tamanos } from './fuentesyColores'
import { he } from 'date-fns/locale';

const { width, height } = Dimensions.get('window');

export const estilosPublicacionesDirector = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    header: {
        width: '100%',
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textoEncabezado: {
        color: colores.terceario,
        fontSize: tamanos.titulo1,
        fontWeight: 'bold',
    },
    backButton: {
        marginHorizontal: width * 0.04,
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
        width: width * 0.30,
        height: height * 0.05,
        justifyContent: 'center',
    },
    pickerWrapperContenido: {
        borderWidth: 1,
        borderColor: colores.tercearioOscuro || '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
        width: width * 0.45,
        height: height * 0.05,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    selectEscuelasContenido: {
        color: colores.quinto,
        width: '100%',
        fontSize: 16,
    },
    filaEncabezado: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    acciones: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 2,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconShadow: {
        textShadowColor: '#7ec3d6',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    contenedor: {
        flex: 1,
        width: '100%',
        backgroundColor: colores.terceario,
        paddingTop: 0,
    },
    filaTitulo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.04,
    },
    titulo: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        color: colores.quinto,
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
    badgeStatus: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 3,
        marginLeft: 'auto',
        alignSelf: 'center',
    },
    badgeStatusText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    badgeRechazada: {
        backgroundColor: colores.cartelError
    },
    badgeRechazadaText: {
        color: colores.letrasError,
    },
    badgePendiente: {
        backgroundColor: colores.cartelAdvertencia,
    },
    badgePendienteText: {
        color: colores.letrasAdvertencia,
    },
    badgeAsignada: {
        backgroundColor: colores.cartelExito,
    },
    badgeAsignadaText: {
        color: colores.letrasExito,
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
});
