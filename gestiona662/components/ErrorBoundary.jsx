import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Podrías enviar esto a un servicio de logging remoto
    console.error('ErrorBoundary atrapó un error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ocurrió un error inesperado</Text>
          <Text style={styles.message}>{String(this.state.error)}</Text>
          <TouchableOpacity onPress={this.handleRetry} style={styles.button}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  message: { fontSize: 14, color: '#444', textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#009fe3', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
