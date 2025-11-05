import { Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { colores } from './styles/fuentesyColores';

export default function AppSnackbar({
  visible,
  message,
  type = 'info',
  onDismiss,
  duration = 3500,
  bottomOffset = 24,
  style,
  textStyle,
}) {
  const palette = {
    success: {
      bg: (colores && (colores.cartelExito)),
      fg: (colores && colores.letrasExito),
    },
    error: {
      bg: (colores && (colores.cartelError)),
      fg: (colores && colores.letrasError),
    },
    warning: {
      bg: (colores && (colores.cartelAdvertencia)),
      fg: (colores && colores.letrasAdvertencia),
    },
    info: {
      bg: (colores && (colores.secundarioClaro)),
      fg: (colores && colores.primario),
    },
  };

  const colors = palette[type] || palette.info;

  return (
    <Snackbar
      visible={!!visible}
      onDismiss={onDismiss}
      duration={duration}
      style={[
        { backgroundColor: colors.bg, marginBottom: bottomOffset },
        style,
      ]}
    >
      <Text style={[{ color: colors.fg, fontWeight: 'bold' }, textStyle]}>
        {message}
      </Text>
    </Snackbar>
  );
}
