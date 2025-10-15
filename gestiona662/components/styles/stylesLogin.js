import { Dimensions, StyleSheet } from 'react-native';
import { colores } from './fuentesyColores';

const { width, height } = Dimensions.get('window');

export const stylesLogin = StyleSheet.create({
    container: {
        flex: 1,                          // ocupa toda la pantalla
        backgroundColor: colores.terceario,
    },
    contentContainer: {
        flexGrow: 1,                      // permite centrar vertical con ScrollView
        justifyContent: 'center',
        paddingHorizontal: width * 0.06,  // padding lateral
    },
    content: {
        width: '100%',
        maxWidth: 420,                    // evita que el formulario sea muy ancho en tablets
        alignSelf: 'center',              // centra horizontalmente el bloque
    },
    // container: {
    //     padding: width * 0.06,
    //     justifyContent: 'center',
    //     marginHorizontal: width * 0.08,
    //     marginVertical: height * 0.15,
    //     backgroundColor: colores.terceario
    // },
    logo: {
        width: width * 0.3,
        height: width * 0.3,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    botonIniciarSesion: {
        backgroundColor: '#009fe3',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        height: height * 0.06,
    },
    textoBotonIniciarSesión: {
        color: colores.cuarto,
        fontWeight: 'bold',
        fontSize: 16,
    },
    botonRegistrarse: {
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    textoBotonRegistrarse: {
        color: '#009fe3',
        fontWeight: 'bold',
        fontSize: 16,
    },
    botonRecuperar: {
        paddingVertical: 8,
        alignItems: 'center',
        marginBottom: 5
    },
    textoBotonRecuperar: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: 14
    },
    titulo: {
        fontSize: 24,
        marginBottom: height * 0.02,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitulo: {
        fontSize: 14,
        marginBottom: height * 0.05,
        textAlign: 'center'
    },
    filaInput: {
        marginBottom: width * 0.02,
    },
    input: {
        backgroundColor: colores.cuarto,
        borderColor: colores.tercearioOscuro,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: colores.quinto,
    },
    error: {
        marginLeft: width * 0.02,
        color: colores.letrasError,
    },
});
