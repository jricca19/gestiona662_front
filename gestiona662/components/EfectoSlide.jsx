import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const EfectoSlide = ({ children, duration = 800, offset = -300, style }) => {
    const offsetX = useSharedValue(offset);

    useEffect(() => {
        offsetX.value = withTiming(0, { duration });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: offsetX.value }]
    }));

    return (
        <Animated.View style={[animatedStyle, style]}>
            {children}
        </Animated.View>
    );
};

export default EfectoSlide;
