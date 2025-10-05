import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { colores, tamanos } from '../styles/fuentesyColores';
import { URL_BACKEND } from '@env';

const { width, height } = Dimensions.get('window')

const PostulacionesPublicacion = ({ navigation, route }) => {
    const postulaciones = route.params?.postulaciones || [];
    const publicacion = route.params?.publicacion || null;
    const [seleccion, setSeleccion] = useState({});
    const [seleccionado, setSeleccionado] = useState(null);
    let fechaFormateada = '';
    if (publicacion.startDate && publicacion.endDate) {
        const inicio = parseISO(publicacion.startDate);
        const fin = parseISO(publicacion.endDate);
        fechaFormateada =
            format(inicio, 'dd', { locale: es }) +
            '-' +
            format(fin, 'dd MMM yyyy', { locale: es }).toUpperCase();
    }

    const onConfirmar = async () => {
        if (!seleccionado || !seleccion[seleccionado] || seleccion[seleccionado].length === 0) {
            Alert.alert('Error', 'Por favor selecciona una postulación y al menos un día.');
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('token');
            const res = await fetch(`${URL_BACKEND}/v1/publications/assignPostulation/multiple`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asignaciones: [
                        {
                            postulationId: seleccionado,
                            selectedDays: seleccion[seleccionado]
                        },
                    ],
                }),
            });

            const data = await res.json();

            if (res.ok) {
                Alert.alert('¡Éxito!', 'Postulación asignada correctamente');
                setSeleccion({});
                setSeleccionado(null);
            } else {
                Alert.alert('Error', 'Error al asignar: ' + data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Error de red al asignar la postulación');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Publicación</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={styles.grado}>
                        {publicacion.grade === 0 ? 'NIVEL INICIAL' : `${publicacion.grade}°`}
                    </Text>
                    <Text style={styles.fecha}>{fechaFormateada}</Text>
                </View>

                <Text style={styles.subtitulo}>Postulados</Text>
                {postulaciones.map((post, idx) => {
                    const postulacionId = post._id
                    const perfil = post.teacherId?.teacherProfile || {};
                    const nombreCompleto = `${post.teacherId?.name ?? ''} ${post.teacherId?.lastName ?? ''}`.trim();

                    let diasPublicacion = [];
                    if (publicacion.startDate && publicacion.endDate) {
                        const start = parseISO(publicacion.startDate);
                        const end = parseISO(publicacion.endDate);
                        let current = new Date(start);
                        while (current <= end) {
                            const raw = current.toISOString().split('T')[0];
                            const label = format(current, 'dd/MM', { locale: es });
                            diasPublicacion.push({ raw, label });
                            current.setDate(current.getDate() + 1);
                        }
                    }

                    const diasElegidos = post.postulationDays.map(d => new Date(d.date).toISOString().split('T')[0]);

                    return (
                        <View
                            key={post._id || idx}
                            style={[
                                styles.card,
                                seleccionado === postulacionId && styles.cardSeleccionada
                            ]}
                        >
                            <View style={styles.etiquetasRow}>
                                <View style={[
                                    styles.etiqueta,
                                    perfil.isEffectiveTeacher ? styles.etiquetaNormal : styles.etiquetaResaltada
                                ]}>
                                    <Text style={[
                                        styles.etiquetaTexto,
                                        perfil.isEffectiveTeacher ? styles.etiquetaTextoNormal : styles.etiquetaTextoResaltada
                                    ]}>
                                        {perfil.isEffectiveTeacher ? 'Efectivo' : 'No efectivo'}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.etiqueta,
                                    post.appliesToAllDays ? styles.etiquetaNormal : styles.etiquetaResaltada
                                ]}>
                                    <Text style={[
                                        styles.etiquetaTexto,
                                        post.appliesToAllDays ? styles.etiquetaTextoNormal : styles.etiquetaTextoResaltada
                                    ]}>
                                        {post.appliesToAllDays ? 'Todos los días' : 'Solo algunos días'}
                                    </Text>
                                </View>
                                <MaterialIcons name="star" size={20} color={'#FFD600'} style={{ marginLeft: 'auto' }} />
                                <Text style={styles.puntaje}>{perfil.rating}</Text>
                            </View>

                            <Text style={styles.nombre}>{nombreCompleto}</Text>

                            <Text style={styles.disponibilidadLabel}>Disponibilidad</Text>
                            <View style={styles.disponibilidadRow}>
                                {diasPublicacion.map((dia, i) => (
                                    <View key={dia.raw + i} style={styles.radioContainer}>
                                        <View style={[
                                            styles.radio,
                                            diasElegidos.includes(dia.raw) && styles.radioSelected
                                        ]} />
                                        <Text style={styles.radioLabel}>{dia.label}</Text>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.seleccionarBtn,
                                    seleccionado !== postulacionId && styles.seleccionarBtnActivo,
                                    seleccionado === postulacionId && styles.seleccionarBtnSinBorde
                                ]}
                                onPress={() => {
                                    setSeleccionado(postulacionId);
                                    setSeleccion(prev => ({
                                        ...prev,
                                        [postulacionId]: diasElegidos
                                    }));
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.seleccionarTexto,
                                    seleccionado !== postulacionId && styles.seleccionarTextoActivo
                                ]}>
                                    {seleccionado === postulacionId ? "Seleccionado" : "Seleccionar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                <TouchableOpacity
                    style={styles.confirmarBtn}
                    onPress={onConfirmar}
                >
                    <Text style={styles.confirmarTexto}>Confirmar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default PostulacionesPublicacion;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },
    header: {
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.04,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: colores.terceario,
        fontSize: tamanos.titulo1,
        fontWeight: 'bold',
    },
    grado: {
        fontSize: tamanos.titulo2,
        fontWeight: 'bold',
        color: colores.quinto,
        marginBottom: 2,
    },
    fecha: {
        fontSize: tamanos.subtitulo,
        color: colores.quinto,
        marginBottom: 10,
    },
    subtitulo: {
        fontWeight: 'bold',
        fontSize: tamanos.subtitulo,
        color: colores.quinto,
        marginLeft: 18,
        marginTop: 10,
        marginBottom: 6,
    },
    card: {
        backgroundColor: colores.secundarioClaro,
        borderRadius: width * 0.04,
        padding: 12,
        marginHorizontal: 12,
        marginBottom: 14,
        elevation: 6,
        borderColor: colores.secundarioClaro,
        borderWidth: 1,
    },
    cardSeleccionada: {
        backgroundColor: colores.secundarioMasClaro,
        borderColor: colores.primario,
        borderWidth: 2,
        elevation: 2,
    },
    etiquetasRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    etiqueta: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 6,
    },
    etiquetaNormal: {
        backgroundColor: colores.terceario,
    },
    etiquetaResaltada: {
        backgroundColor: colores.terceario,
    },
    etiquetaTexto: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    etiquetaTextoNormal: {
        color: colores.tercearioOscuro,
    },
    etiquetaTextoResaltada: {
        color: colores.tercearioOscuro,
    },
    puntaje: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colores.quinto,
        marginLeft: 2,
    },
    nombre: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colores.quinto,
        marginBottom: 4,
        marginTop: 2,
    },
    disponibilidadLabel: {
        fontSize: 14,
        color: colores.quinto,
        marginBottom: 2,
        textAlign: 'center',
        alignSelf: 'center',
    },
    disponibilidadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.02,
        marginTop: 2,
        marginLeft: width * 0.15,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: width * 0.07,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colores.tercearioOscuro,
        backgroundColor: colores.cuarto,
        marginRight: 4,
    },
    radioSelected: {
        backgroundColor: colores.primario,
        borderColor: colores.primarioOscuro,
    },
    radioLabel: {
        fontSize: 14,
        color: colores.quinto,
    },
    seleccionarBtn: {
        alignSelf: 'center',
        marginTop: 2,
        paddingVertical: 6,
        paddingHorizontal: 22,
        borderRadius: 8,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colores.primario,
    },
    seleccionarBtnActivo: {
        backgroundColor: colores.primario,
    },
    seleccionarBtnSinBorde: {
        borderWidth: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    },
    seleccionarTexto: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'none',
    },
    seleccionarTextoActivo: {
        color: colores.cuarto,
    },
    confirmarBtn: {
        backgroundColor: colores.primario,
        borderRadius: 8,
        paddingVertical: 13,
        alignItems: 'center',
        marginHorizontal: 30,
        marginTop: 10,
        marginBottom: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    confirmarTexto: {
        color: colores.cuarto,
        fontWeight: 'bold',
        fontSize: tamanos.texto,
    },
});