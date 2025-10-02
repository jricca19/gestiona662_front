import { useEffect, useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { Text, StyleSheet, Pressable } from 'react-native';
import { colores, tamanos } from './styles/fuentesyColores';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const BotonPulsaciones = ({ onPress, loading, text = 'Presioname', loadingText = 'Cargando...', pulse = false }) => {
    const scale = useSharedValue(1);
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
        if (loading || pulse) {
            scale.value = withRepeat(withTiming(1.10, { duration: 200 }), -1, true);
        } else {
            scale.value = withTiming(1, { duration: 200 });
        }
    }, [loading, pulse]);

    const animatedStyle = useAnimatedStyle(() => {
        const pressScale = pressed && !loading ? 0.9 : 1;
        return {
            transform: [{ scale: scale.value * pressScale }],
            backgroundColor: loading ? colores.secundario : colores.primario,
        };
    });

    return (
        <Pressable
            onPress={onPress}
            disabled={loading}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <Animated.View style={[styles.button, animatedStyle]}>
                {loading ? (
                    <Text style={styles.text}>{loadingText}</Text>
                ) : (
                    <Text style={styles.text}>{text}</Text>
                )}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: width * 0.025,
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.2,
        alignItems: 'center',
        elevation: 2,
        marginVertical: height * 0.04,
    },
    text: {
        color: colores.terceario,
        fontWeight: 'bold',
        fontSize: tamanos.textoMayor,
    }
});

export default BotonPulsaciones;
