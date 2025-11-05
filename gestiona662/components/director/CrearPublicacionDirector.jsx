import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Pressable, Alert, Switch, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { stylesCrearPublicacion } from '../styles/stylesCrearPublicacion';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { URL_BACKEND } from '@env';
import { fechaStringAFechaUTC, fechaAStringISO, formatoFechaDDMMYYYY, contarDiasLaborales } from '../../utils/dates';
import { colores } from '../styles/fuentesyColores';

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
    const [isType662, setIsType662] = useState(false);

    const handleCrearPublicacion = async () => {
        if (!escuelaSeleccionada || !grado || !desde || !hasta || !ayuda) {
            Alert.alert('Campos requeridos', 'Por favor complete todos los campos requeridos.');
            return;
        }

        const desdeDate = fechaStringAFechaUTC(desde);
        const hastaDate = fechaStringAFechaUTC(hasta);

        if (hastaDate < desdeDate) {
            Alert.alert('Rango de fechas inválido', 'La fecha de fin debe ser mayor o igual a la fecha de inicio.');
            return;
        }
        // Comparar usando medianoche UTC para evitar desfases por zona horaria
        if (desdeDate < hoyUTC) {
            Alert.alert('Fecha inválida', 'La fecha de inicio no puede ser anterior a hoy.');
            return;
        }
        if ([desdeDate.getUTCDay(), hastaDate.getUTCDay()].some(d => d === 0 || d === 6)) {
            Alert.alert('Fecha inválida', 'La fecha de inicio o fin no puede ser un fin de semana.');
            return;
        }

        const workingCount = contarDiasLaborales(desde, hasta);
        if (isType662 && workingCount > 3) {
            Alert.alert('Rango de fechas inválido', 'No se pueden crear publicaciones para más de 3 días hábiles en suplencias tipo 662.');
            return;
        }
        if (!isType662 && workingCount > 30) {
            Alert.alert('Rango de fechas inválido', 'No se pueden crear publicaciones para más de 30 días hábiles en suplencias generales.');
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
            case 'Tiempo Completo':
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
            isType662,
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
                setIsType662(false);
                // Navegar y mostrar snackbar en la pantalla de publicaciones
                navigation.navigate('directorTabs', {
                    screen: 'misPublicaciones',
                    params: { refresh: true, flashMessage: 'Publicación creada correctamente' }
                });
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

    // Hoy en horario local (para los pickers) y en UTC (para validaciones lógicas)
    const hoyLocal = new Date();
    hoyLocal.setHours(0, 0, 0, 0);
    const hoyUTC = fechaStringAFechaUTC(fechaAStringISO(new Date()));

    return (
        <View style={stylesCrearPublicacion.container}>
            <View style={stylesCrearPublicacion.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={stylesCrearPublicacion.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colores.cuarto} />
                </TouchableOpacity>
                <Text style={stylesCrearPublicacion.headerTitle}>Crear publicación</Text>
            </View>
            <KeyboardAvoidingView
                style={stylesCrearPublicacion.container}
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    contentContainerStyle={stylesCrearPublicacion.contentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={stylesCrearPublicacion.form}>
                        <Text style={stylesCrearPublicacion.label}>Escuela</Text>
                        <TouchableOpacity style={stylesCrearPublicacion.inputRow} onPress={() => setModalEscuela(true)}>
                            <TextInput
                                style={stylesCrearPublicacion.input}
                                placeholder="Seleccione escuela..."
                                placeholderTextColor={colores.tercearioOscuro}
                                value={typeof escuelaSeleccionada === 'object' && escuelaSeleccionada !== null
                                    ? String(escuelaSeleccionada.schoolNumber)
                                    : ''
                                }
                                editable={false}
                                pointerEvents="none"
                            />
                            <MaterialIcons name="arrow-drop-down" size={24} color={colores.tercearioOscuro} style={stylesCrearPublicacion.iconInput} />
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
                                placeholderTextColor={colores.tercearioOscuro}
                                value={grado}
                                editable={false}
                                pointerEvents="none"
                            />
                            <MaterialIcons name="arrow-drop-down" size={24} color={colores.tercearioOscuro} style={stylesCrearPublicacion.iconInput} />
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

                        <Text style={stylesCrearPublicacion.label}>¿Es suplencia 662?</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Switch
                                value={isType662}
                                onValueChange={setIsType662}
                                thumbColor={isType662 ? colores.primario : colores.grisOscuro}
                                trackColor={{ false: colores.grisOscuro, true: colores.primarioOscuro }}
                                style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                            />
                        </View>

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
                                        value={desde ? formatoFechaDDMMYYYY(desde) : ''}
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                    <MaterialIcons
                                        name="calendar-today"
                                        size={25}
                                        color={colores.primario}
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
                                        value={hasta ? formatoFechaDDMMYYYY(hasta) : ''}
                                        editable={false}
                                        pointerEvents="none"
                                    />
                                    <MaterialIcons
                                        name="calendar-today"
                                        size={25}
                                        color={colores.primario}
                                        style={stylesCrearPublicacion.iconInput}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showDesdePicker && (
                            <DateTimePicker
                                value={desde ? fechaStringAFechaUTC(desde) : hoyLocal}
                                mode="date"
                                display="default"
                                minimumDate={hoyLocal}
                                onChange={(event, selectedDate) => {
                                    setShowDesdePicker(false);
                                    if (selectedDate) {
                                        setDesde(fechaAStringISO(selectedDate));
                                    }
                                }}
                            />
                        )}

                        {showHastaPicker && (
                            <DateTimePicker
                                value={hasta ? fechaStringAFechaUTC(hasta) : hoyLocal}
                                mode="date"
                                display="default"
                                minimumDate={hoyLocal}
                                onChange={(event, selectedDate) => {
                                    setShowHastaPicker(false);
                                    if (selectedDate) {
                                        setHasta(fechaAStringISO(selectedDate));
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
                            placeholderTextColor={colores.tercearioOscuro}
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
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    );
};

export default CrearPublicacionDirector;
