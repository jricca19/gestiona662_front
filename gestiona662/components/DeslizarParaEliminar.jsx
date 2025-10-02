import { Alert, Text, StyleSheet } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { colores } from './styles/fuentesyColores';

const { width, height } = Dimensions.get('window');

const DeslizarParaEliminar = ({ children, onDelete, confirmMessage = "¿Seguro que desea eliminar este elemento?" }) => {
    const renderRightActions = () => (
        <RectButton
            style={styles.deleteButton}
            onPress={() => {
                Alert.alert("Eliminar", confirmMessage, [
                    { text: "Cancelar" },
                    { text: "Eliminar", onPress: onDelete }
                ])
            }}
        >
            <Text style={styles.deleteText}>Eliminar</Text>
        </RectButton>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            {children}
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: colores.cartelError,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: width * 0.2,
        height: height * 0.15,
        borderRadius: width * 0.03,
        marginRight: width * 0.03,
        elevation: 5,
        shadowColor: '#000',
    },
    deleteText: {
        color: colores.letrasError,
        fontWeight: 'bold',
    }
});

export default DeslizarParaEliminar;
