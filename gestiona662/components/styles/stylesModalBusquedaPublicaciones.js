import { StyleSheet, Dimensions } from 'react-native';
import { colores, tamanos } from './fuentesyColores';

const { width, height } = Dimensions.get('window');

export const estilosModalBusqueda = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contenedorModal: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        width: width * 0.9,
        maxHeight: height * 0.8,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        backgroundColor: colores.primario,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    tituloModal: {
        color: '#fff',
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
    },
    botonCerrar: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contenidoScroll: {
        padding: width * 0.05,
    },
    contenedorCampo: {
        marginBottom: height * 0.025,
    },
    selectorContainer: {
        backgroundColor: colores.cuarto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colores.tercearioOscuro,
        position: 'relative',
        minHeight: 50,
        justifyContent: 'center',
    },
    picker: {
        height: height * 0.06,
        color: colores.quinto,
        backgroundColor: 'transparent',
    },
    tituloBuscarDesde: {
        fontSize: tamanos.textoMayor,
        fontWeight: 'bold',
        color: colores.quinto,
        marginBottom: height * 0.015,
        marginTop: height * 0.02,
        textAlign: 'center',
    },
    selectorFecha: {
        backgroundColor: colores.cuarto,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colores.tercearioOscuro,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        minHeight: 50,
        width: width * 0.8,
    },
    textoFecha: {
        fontSize: tamanos.texto,
        color: colores.quinto,
    },
    contenedorBotones: {
        marginTop: height * 0.03,
        gap: height * 0.015,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonAplicar: {
        backgroundColor: colores.primario,
        borderRadius: width * 0.04,
        paddingVertical: height * 0.018,
        alignItems: 'center',
        elevation: 3,
        width: '70%',
    },
    textoBotonAplicar: {
        color: '#fff',
        fontSize: tamanos.textoMayor,
        fontWeight: 'bold',
    },
    botonLimpiar: {
        backgroundColor: 'transparent',
        paddingVertical: height * 0.018,
        alignItems: 'center',
        width: '70%',
    },
    textoBotonLimpiar: {
        color: colores.primario,
        fontSize: tamanos.textoMayor,
        fontWeight: '600',
        textDecorationLine: 'none',
    },
});
