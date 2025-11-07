import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { colores, tamanos } from '../styles/fuentesyColores';
import { URL_BACKEND } from '@env';
import { formatoFecha, fechaStringAFechaUTC, fechaAStringISO } from '../../utils/dates';

const { width, height } = Dimensions.get('window')

const enumerarDiasLaborales = (inicioISO, finISO) => {
    const [ys, ms, ds] = inicioISO.split('-').map(Number);
    const [ye, me, de] = finISO.split('-').map(Number);
    const inicio = new Date(Date.UTC(ys, ms - 1, ds));
    const fin = new Date(Date.UTC(ye, me - 1, de));
    const dias = [];
    for (let d = new Date(inicio); d <= fin; d.setUTCDate(d.getUTCDate() + 1)) {
        const wd = d.getUTCDay();
        if (wd >= 1 && wd <= 5) {
            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            dias.push(`${y}-${m}-${day}`);
        }
    }
    return dias;
}

const PostulacionesPublicacion = ({ navigation, route }) => {
    const postulaciones = route.params?.postulaciones || [];
    const publicacion = route.params?.publicacion || null;
    const [seleccion, setSeleccion] = useState({});
    let fechaFormateada = '';
    if (publicacion.startDate && publicacion.endDate) {
        const inicioISO = fechaAStringISO(publicacion.startDate);
        const finISO = fechaAStringISO(publicacion.endDate);
        fechaFormateada = `${formatoFecha(inicioISO, 'dd')}-${formatoFecha(finISO, 'dd MMM yyyy').toUpperCase()}`;
    }

    const inicioISO = publicacion.startDate ? fechaAStringISO(publicacion.startDate) : null;
    const finISO = publicacion.endDate ? fechaAStringISO(publicacion.endDate) : null;

    const rangoDias = useMemo(() => {
        if (!inicioISO || !finISO) return [];
        return enumerarDiasLaborales(inicioISO, finISO);
    }, [inicioISO, finISO]);

    const totalDias = rangoDias.length;

    const mapNombrePorId = useMemo(() => {
        const map = {};
        postulaciones.forEach(p => {
            const nombreCompleto = `${p.teacherId?.name ?? ''} ${p.teacherId?.lastName ?? ''}`.trim();
            map[p._id] = nombreCompleto || 'Sin nombre';
        });
        return map;
    }, [postulaciones]);

    const asignadoPorDia = useMemo(() => {
        const map = {};
        Object.entries(seleccion).forEach(([pid, dias]) => {
            (dias || []).forEach(d => {
                map[d] = pid;
            });
        });
        return map;
    }, [seleccion]);

    const cubiertos = Object.keys(asignadoPorDia).length;
    const puedeConfirmar = totalDias > 0 && cubiertos === totalDias;

    const getDiasDisponibles = (post) => {
        if (!post) return [];
        if (post.appliesToAllDays) return rangoDias;
        const setRango = new Set(rangoDias);
        const dias = (Array.isArray(post.postulationDays) ? post.postulationDays : [])
            .map(d => fechaAStringISO(d.date))
            .filter(d => setRango.has(d));
        return dias;
    };

    const toggleSeleccionMaestro = (post) => {
        const pid = post._id;
        const yaSeleccionado = !!seleccion[pid];
        if (yaSeleccionado) {
            setSeleccion(prev => {
                const copia = { ...prev };
                delete copia[pid];
                return copia;
            });
            return;
        }
        const disponibles = getDiasDisponibles(post);
        const iniciales = disponibles.filter(d => !asignadoPorDia[d]);
        if (iniciales.length === 0) {
            Alert.alert('Sin días disponibles', 'Este postulante no tiene días libres sin conflicto.');
            return;
        }
        setSeleccion(prev => ({ ...prev, [pid]: iniciales }));
    };

    const toggleDiaParaMaestro = (post, diaISO) => {
        const pid = post._id;
        const disponibles = new Set(getDiasDisponibles(post));
        if (!disponibles.has(diaISO)) return;
        const asignadoA = asignadoPorDia[diaISO];
        const esDeOtro = asignadoA && asignadoA !== pid;
        if (esDeOtro) {
            Alert.alert('Día ocupado', 'Ese día ya está asignado a otro postulante.');
            return;
        }
        setSeleccion(prev => {
            const actual = new Set(prev[pid] || []);
            if (actual.has(diaISO)) {
                actual.delete(diaISO);
            } else {
                actual.add(diaISO);
            }
            const arr = Array.from(actual);
            if (arr.length === 0) {
                const copia = { ...prev };
                delete copia[pid];
                return copia;
            }
            return { ...prev, [pid]: arr };
        });
    };

    const onConfirmar = async () => {
        if (!puedeConfirmar) {
            Alert.alert('Cobertura incompleta', 'Debes cubrir todos los días de la publicación sin superposiciones.');
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('token');
            const asignaciones = Object.entries(seleccion).map(([postulationId, selectedDays]) => ({
                postulationId,
                selectedDays,
            }));

            const res = await fetch(`${URL_BACKEND}/v1/publications/assignPostulation/multiple`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ asignaciones }),
            });

            const data = await res.json();

            if (res.ok) {
                Alert.alert('¡Éxito!', 'Postulación asignada correctamente');
                setSeleccion({});
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
                    <Ionicons name="arrow-back" size={28} color={colores.cuarto} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Selección de postulantes</Text>
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.encabezadoPostulaciones}>
                    <View style={styles.headerChipsRow}>
                        <View style={styles.chip}>
                            <Text style={styles.chipLabel}>Año:</Text>
                            <Text style={styles.chipValue}>
                                {publicacion.grade === 0 ? 'NIVEL INICIAL' : `${publicacion.grade}°`}
                            </Text>
                        </View>
                        {(inicioISO && finISO) ? (
                            <View style={styles.chip}>
                                <Text style={styles.chipLabel}>Periodo:</Text>
                                <Text style={styles.chipValue}>
                                    {`${formatoFecha(inicioISO, 'dd')}-${formatoFecha(finISO, 'dd MMM yyyy').toUpperCase()}`}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                    {totalDias > 0 && (
                        <View style={styles.chipCoverage}>
                            <View style={styles.chipCoverageHeader}>
                                <Text style={styles.chipLabel}>Días cubiertos:</Text>
                                <Text style={styles.chipValue}>{cubiertos}/{totalDias}</Text>
                            </View>
                            <View style={styles.chipDivider} />
                            <View style={styles.chipCoverageDaysRow}>
                                {rangoDias.map(d => {
                                    const pid = asignadoPorDia[d];
                                    const asignado = !!pid;
                                    const etiqueta = formatoFecha(d, 'dd/MM');
                                    return (
                                        <View key={d} style={[styles.calDayChip, styles.calDayChipTiny]}>
                                            <Text
                                                style={[
                                                    styles.calDayChipText,
                                                    styles.calDayChipTextTiny,
                                                    asignado ? styles.calDayChipTextAssigned : styles.calDayChipTextUnassigned,
                                                ]}
                                            >
                                                {etiqueta}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}
                </View>
                <FlatList
                    data={postulaciones}
                    keyExtractor={(item, index) => item?._id ?? String(index)}
                    ListHeaderComponent={() => (
                        <Text style={styles.subtitulo}>Postulados</Text>
                    )}
                    renderItem={({ item: post }) => {
                        const postulacionId = post._id;
                        const perfil = post.teacherId?.teacherProfile || {};
                        const nombreCompleto = `${post.teacherId?.name ?? ''} ${post.teacherId?.lastName ?? ''}`.trim();

                        const diasDisponibles = getDiasDisponibles(post);
                        const seleccionado = !!seleccion[postulacionId];
                        const diasAsignadosEste = new Set(seleccion[postulacionId] || []);

                        return (
                            <TouchableOpacity
                                style={[styles.card, seleccionado && styles.cardSeleccionada]}
                                onPress={() => toggleSeleccionMaestro(post)}
                                activeOpacity={0.9}
                            >
                                <View style={styles.etiquetasRow}>
                                    <View style={[styles.etiqueta, perfil.isEffectiveTeacher ? styles.etiquetaNormal : styles.etiquetaResaltada]}>
                                        <Text style={[styles.etiquetaTexto, perfil.isEffectiveTeacher ? styles.etiquetaTextoNormal : styles.etiquetaTextoResaltada]}>
                                            {perfil.isEffectiveTeacher ? 'Efectivo' : 'No efectivo'}
                                        </Text>
                                    </View>
                                    <View style={[styles.etiqueta, post.appliesToAllDays ? styles.etiquetaNormal : styles.etiquetaResaltada]}>
                                        <Text style={[styles.etiquetaTexto, post.appliesToAllDays ? styles.etiquetaTextoNormal : styles.etiquetaTextoResaltada]}>
                                            {post.appliesToAllDays ? 'Puede todos los días' : 'Puede solo algunos días'}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="star" size={20} color={'#FFD600'} style={{ marginLeft: 'auto' }} />
                                    <Text style={styles.puntaje}>{perfil.rating}</Text>
                                </View>

                                <Text style={styles.nombre}>{nombreCompleto}</Text>

                                <Text style={styles.disponibilidadLabel}>Días de disponibilidad</Text>
                                <View style={styles.disponibilidadRow}>
                                    {diasDisponibles.map((d) => {
                                        const asignadoA = asignadoPorDia[d];
                                        const esMio = asignadoA === postulacionId;
                                        const ocupadoOtro = asignadoA && !esMio;
                                        const label = formatoFecha(d, 'dd/MM');
                                        return (
                                            <TouchableOpacity
                                                key={`${postulacionId}-${d}`}
                                                style={[
                                                    styles.dayBox,
                                                    esMio ? styles.dayBoxAvailable : styles.dayBoxNeutral,
                                                    ocupadoOtro && styles.dayBoxUnavailable,
                                                    seleccionado && !ocupadoOtro && !esMio && styles.dayBoxSelectable,
                                                ]}
                                                onPress={() => {
                                                    if (!seleccionado) return toggleSeleccionMaestro(post);
                                                    if (ocupadoOtro) return toggleSeleccionMaestro(post);
                                                    toggleDiaParaMaestro(post, d);
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    style={[
                                                        styles.dayBoxText,
                                                        esMio ? styles.dayBoxTextAvailable : styles.dayBoxTextNeutral,
                                                        ocupadoOtro && styles.dayBoxTextUnavailable,
                                                    ]}
                                                >
                                                    {label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListFooterComponent={postulaciones.length > 0 ? (
                        <TouchableOpacity
                            style={styles.confirmarBtn}
                            onPress={() => { onConfirmar(); }}
                        >
                            <Text style={styles.confirmarTexto}>Confirmar</Text>
                        </TouchableOpacity>
                    ) : null}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            </View>
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
        width: '100%',
        backgroundColor: colores.primario,
        paddingVertical: height * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    botonAtras: {
        marginHorizontal: width * 0.04,
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
        marginHorizontal: 12,
        marginTop: 10,
    },
    encabezadoPostulaciones: {
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingVertical: 10,
        paddingHorizontal: 8,
        elevation: 6,
        backgroundColor: colores.terceario,
        borderBottomWidth: 1,
        borderColor: colores.tercearioOscuro,
    },
    headerChipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
        marginBottom: 4,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colores.secundarioMasClaro,
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    chipCoverage: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
        gap: 2,
        backgroundColor: colores.secundarioMasClaro,
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    chipCoverageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipDivider: {
        alignSelf: 'stretch',
        height: StyleSheet.hairlineWidth,
        backgroundColor: colores.tercearioOscuro,
        opacity: 0.4,
        marginVertical: 2,
    },
    chipCoverageDaysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    chipLabel: {
        color: colores.primario,
        fontWeight: 'bold',
        fontSize: tamanos.menu,
        marginRight: 6,
    },
    chipValue: {
        fontSize: tamanos.texto,
        fontWeight: 'bold',
        color: colores.quinto,
    },
    card: {
        backgroundColor: colores.secundarioClaro,
        borderRadius: width * 0.04,
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 14,
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
        backgroundColor: colores.cartelExito,
    },
    etiquetaResaltada: {
        backgroundColor: colores.cartelAdvertencia,
    },
    etiquetaTexto: {
        fontWeight: 'bold',
        fontSize: 13,
    },
    etiquetaTextoNormal: {
        color: colores.letrasExito,
    },
    etiquetaTextoResaltada: {
        color: colores.letrasAdvertencia,
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
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.02,
        marginTop: 2,
        marginLeft: 0,
        paddingHorizontal: 6,
    },
    dayBox: {
        minWidth: 56,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        margin: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayBoxAvailable: {
        backgroundColor: colores.primario,
        borderColor: colores.primarioOscuro,
    },
    dayBoxNeutral: {
        backgroundColor: colores.secundarioMasClaro,
        borderColor: colores.terceario,
    },
    dayBoxUnavailable: {
        backgroundColor: colores.secundarioMasClaro,
        borderColor: colores.terceario,
    },
    dayBoxSelectable: {
        backgroundColor: colores.secundarioClaro,
        borderColor: colores.primario,
    },
    dayBoxText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colores.quinto,
    },
    dayBoxTextAvailable: {
        color: colores.cuarto,
    },
    dayBoxTextNeutral: {
        color: colores.quinto,
    },
    dayBoxTextUnavailable: {
        color: colores.terceario,
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
    sinPublicaciones: {
        alignItems: 'center',
        marginTop: 32,
        paddingHorizontal: 24,
    },
    textoFinalLista: {
        textAlign: 'center',
        color: colores.quinto,
        marginBottom: 16,
    },
    sinPublicacionesImagen: {
        width: 260,
        height: 200,
    },
    coberturaDiasRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 2,
        marginBottom: 4,
    },
    calDayChip: {
        minWidth: 0,
        paddingVertical: 1,
        paddingHorizontal: 3,
        borderRadius: 8,
        borderWidth: 0,
        margin: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    calDayChipTiny: {
        paddingVertical: 0,
        paddingHorizontal: 2,
        margin: 1,
        borderRadius: 6,
    },
    calDayChipText: {
        fontSize: 11,
        fontWeight: '700',
    },
    calDayChipTextTiny: {
        fontSize: 10,
        fontWeight: '700',
    },
    calDayChipTextAssigned: {
        color: colores.primario,
    },
    calDayChipTextUnassigned: {
        color: colores.letrasError,
    },
});