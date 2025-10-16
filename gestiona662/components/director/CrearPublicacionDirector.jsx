import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Pressable, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { stylesCrearPublicacion } from '../styles/stylesCrearPublicacion';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { URL_BACKEND } from '@env';

const grados = ['0', '1', '2', '3', '4', '5', '6'];

const CrearPublicacionDirector = ({ navigation }) => {
    const [showDesdePicker, setShowDesdePicker] = useState(false);
    const [showHastaPicker, setShowHastaPicker] = useState(false);
    const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
    const [escuelas, setEscuelas] = useState([]);
    const [grado, setGrado] = useState('');
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [turno, setTurno] = useState('Matutino');
    const [ayuda, setAyuda] = useState('');
    const [modalEscuela, setModalEscuela] = useState(false);
    const [modalGrado, setModalGrado] = useState(false);

    const handleCrearPublicacion = async () => {
        if (!escuelaSeleccionada || !grado || !desde || !hasta || !ayuda) {
            Alert.alert('Campos requeridos', 'Por favor complete todos los campos requeridos.');
            return;
        }

        const desdeDate = new Date(desde);
        const hastaDate = new Date(hasta);
        const diffMs = hastaDate - desdeDate;
        const diffDias = diffMs / (1000 * 60 * 60 * 24);
        if (diffDias > 2) {
            Alert.alert('Rango de fechas inválido', 'No puede solicitar más de 3 días.');
            return;
        }

        let shiftValue = '';
        switch (turno) {
            case 'Matutino':
                shiftValue = 'MORNING';
                break;
            case 'Vespertino':
                shiftValue = 'AFTERNOON';
                break;
            case 'Tiempo completo':
                shiftValue = 'FULL_DAY';
                break;
            default:
                shiftValue = '';
        }

        const payload = {
            schoolId: escuelaSeleccionada._id,
            grade: grado,
            startDate: desde,
            endDate: hasta,
            shift: shiftValue,
            details: ayuda,
        };

        try {
            const token = await SecureStore.getItemAsync('token');

            const res = await fetch(`${URL_BACKEND}/v1/publications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setEscuelaSeleccionada(null);
                setGrado('');
                setDesde('');
                setHasta('');
                setTurno('Matutino');
                setAyuda('');
                Alert.alert(
                    '¡Éxito!',
                    'Publicación creada correctamente',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                navigation.navigate('directorTabs', { screen: 'misPublicaciones', params: { refresh: true } });
                            },
                        },
                    ]
                );
            } else {
                const errorData = await res.json();
                Alert.alert('Error al crear publicación', errorData.message || 'No se pudo crear la publicación.');
            }
        } catch (error) {
            Alert.alert('Error de conexión', String(error));
        }
    };

    useEffect(() => {
        const obtenerEscuelas = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');

                const res = await fetch(`${URL_BACKEND}/v1/schools/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setEscuelas(data);
                } else {
                    console.error('Error al obtener escuelas:', data.message || 'Respuesta no OK');
                }
            } catch (error) {
                console.error('Error al cargar escuelas:', error);
            }
        };

        obtenerEscuelas();
    }, []);

    return (
        <View style={stylesCrearPublicacion.container}>
            <View style={stylesCrearPublicacion.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={stylesCrearPublicacion.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={stylesCrearPublicacion.headerTitle}>Crear publicación</Text>
            </View>
            <View style={stylesCrearPublicacion.form}>
                <Text style={stylesCrearPublicacion.label}>Escuela</Text>
                <TouchableOpacity style={stylesCrearPublicacion.inputRow} onPress={() => setModalEscuela(true)}>
                    <TextInput
                        style={stylesCrearPublicacion.input}
                        placeholder="Seleccione escuela..."
                        placeholderTextColor="#888"
                        value={typeof escuelaSeleccionada === 'object' && escuelaSeleccionada !== null
                            ? String(escuelaSeleccionada.schoolNumber)
                            : ''
                        }
                        editable={false}
                        pointerEvents="none"
                    />
                    <MaterialIcons name="arrow-drop-down" size={24} color="#888" style={stylesCrearPublicacion.iconInput} />
                </TouchableOpacity>
                <Modal visible={modalEscuela} transparent animationType="fade">
                    <Pressable style={stylesCrearPublicacion.modalOverlay} onPress={() => setModalEscuela(false)}>
                        <View style={stylesCrearPublicacion.modalBox}>
                            <FlatList
                                data={escuelas}
                                keyExtractor={item => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={stylesCrearPublicacion.modalItem}
                                        onPress={() => {
                                            setEscuelaSeleccionada(item);
                                            setModalEscuela(false);
                                        }}>
                                        <Text>{item.schoolNumber}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>

                <Text style={stylesCrearPublicacion.label}>Grado</Text>
                <TouchableOpacity style={stylesCrearPublicacion.inputRow} onPress={() => setModalGrado(true)}>
                    <TextInput
                        style={stylesCrearPublicacion.input}
                        placeholder="Seleccione grado..."
                        placeholderTextColor="#888"
                        value={grado}
                        editable={false}
                        pointerEvents="none"
                    />
                    <MaterialIcons name="arrow-drop-down" size={24} color="#888" style={stylesCrearPublicacion.iconInput} />
                </TouchableOpacity>

                <Modal visible={modalGrado} transparent animationType="fade">
                    <Pressable style={stylesCrearPublicacion.modalOverlay} onPress={() => setModalGrado(false)}>
                        <View style={stylesCrearPublicacion.modalBox}>
                            <FlatList
                                data={grados}
                                keyExtractor={item => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={stylesCrearPublicacion.modalItem}
                                        onPress={() => {
                                            setGrado(item);
                                            setModalGrado(false);
                                        }}>
                                        <Text>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>

                <View style={stylesCrearPublicacion.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={stylesCrearPublicacion.label}>Desde:</Text>
                        <TouchableOpacity
                            style={stylesCrearPublicacion.inputRow}
                            onPress={() => setShowDesdePicker(true)}
                        >
                            <TextInput
                                style={stylesCrearPublicacion.input}
                                placeholder="Seleccione fecha..."
                                value={desde}
                                editable={false}
                                pointerEvents="none"
                            />
                            <MaterialIcons
                                name="calendar-today"
                                size={20}
                                color="#03A9E0"
                                style={stylesCrearPublicacion.iconInput}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={stylesCrearPublicacion.label}>Hasta:</Text>
                        <TouchableOpacity
                            style={stylesCrearPublicacion.inputRow}
                            onPress={() => setShowHastaPicker(true)}
                        >
                            <TextInput
                                style={stylesCrearPublicacion.input}
                                placeholder="Seleccione fecha..."
                                value={hasta}
                                editable={false}
                                pointerEvents="none"
                            />
                            <MaterialIcons
                                name="calendar-today"
                                size={20}
                                color="#03A9E0"
                                style={stylesCrearPublicacion.iconInput}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {showDesdePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDesdePicker(false);
                            if (selectedDate) {
                                const fecha = selectedDate.toISOString().split('T')[0];
                                setDesde(fecha);
                            }
                        }}
                    />
                )}

                {showHastaPicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowHastaPicker(false);
                            if (selectedDate) {
                                const fecha = selectedDate.toISOString().split('T')[0];
                                setHasta(fecha);
                            }
                        }}
                    />
                )}

                <Text style={stylesCrearPublicacion.label}>Turno:</Text>
                <View style={stylesCrearPublicacion.turnoRow}>
                    {['Matutino', 'Vespertino', 'Tiempo Completo'].map((opcion) => (
                        <TouchableOpacity
                            key={opcion}
                            style={stylesCrearPublicacion.turnoOpcion}
                            onPress={() => setTurno(opcion)}
                        >
                            <View style={[
                                stylesCrearPublicacion.radio,
                                turno === opcion && stylesCrearPublicacion.radioSelected
                            ]} />
                            <Text style={stylesCrearPublicacion.turnoText}>{opcion}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={stylesCrearPublicacion.label}>Ayuda para el suplente:</Text>
                <TextInput
                    style={stylesCrearPublicacion.textArea}
                    placeholder="Ingrese detalle..."
                    placeholderTextColor="#888"
                    value={ayuda}
                    onChangeText={setAyuda}
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity style={stylesCrearPublicacion.boton}
                    onPress={handleCrearPublicacion}>
                    <Text style={stylesCrearPublicacion.botonTexto}>Crear publicación</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CrearPublicacionDirector;
