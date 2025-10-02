import { StyleSheet, Dimensions } from 'react-native';
import { colores, tamanos } from './fuentesyColores';

const { width, height } = Dimensions.get('window');

export const stylesRegistro = StyleSheet.create({
  contenedor: {
    padding: width * 0.08,
    justifyContent: 'center',
    marginBottom: height * 0.15,
    backgroundColor: colores.terceario,
    width: '100%',
  },
  encabezado: {
    width: '100%',
    backgroundColor: colores.primario,
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textoEncabezado: {
    color: colores.cuarto,
    fontSize: 22,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: colores.primario,
  },
  label: {
    color: colores.primario,
    fontWeight: 'bold',
    fontSize: 14,
  },
  error: {
    marginLeft: width * 0.1,
    color: colores.letrasError,
  },
  input: {
    color: colores.quinto,
    borderColor: colores.tercearioOscuro,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  botonRegistrarse: {
    backgroundColor: colores.primario,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    height: height * 0.06,
  },
  textoBotonRegistrarse: {
    color: colores.cuarto,
    fontWeight: 'bold',
    fontSize: 16,
  },
  filaIcono: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  iconSeparado: {
    marginRight: 10,
  },
  selectorContainer: {
    flex: 1,
    color: colores.quinto,
    backgroundColor: colores.cuarto,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.tercearioOscuro,
    height: height * 0.05,
    justifyContent: 'center',
    marginRight: 5,
  },
  pickerEscuela: {
    height: height * 0.06,
    color: colores.quinto,
    backgroundColor: 'transparent',
  },
  encabezadoConFlecha: {
    width: '100%',
    backgroundColor: colores.primario,
    paddingVertical: height * 0.01,
    justifyContent: 'center',
    position: 'relative',
  },
  iconoAtrasWrapper: {
    position: 'absolute',
    left: width * 0.05,
    zIndex: 2,
  },

  textoEncabezadoConFlecha: {
    textAlign: 'center',
    color: colores.terceario,
    fontSize: tamanos.titulo1,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: width * 0.05,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: colores.quinto,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colores.cuarto,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    textAlign: 'center',
    color: colores.primario,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  modalButton: {
    backgroundColor: colores.primario,
    borderRadius: width * 0.02,
    padding: height * 0.015,
    minWidth: width * 0.3,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colores.cuarto,
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputModal: {
    borderColor: colores.tercearioOscuro,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    color: colores.quinto,
    marginBottom: 10,
    height: height * 0.07,
  },
  botonAgregarEscuela: {
    width: 40,
    height: 40,
    backgroundColor: colores.primario,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  botonAgregarTexto: {
    color: colores.cuarto,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2
  },
  pickerWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.tercearioOscuro,
    backgroundColor: colores.cuarto,
    marginBottom: 10,
    height: height * 0.07,
  },
  pickerDptoyCiudad: {
    height: height * 0.06,
    color: colores.quinto,
    backgroundColor: 'transparent',
  },
});
