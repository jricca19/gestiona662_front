import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, Switch } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { desloguear } from '../../store/slices/usuarioSlice';
import * as SecureStore from 'expo-secure-store';
import { stylesPerfil } from '../styles/stylesPerfil';
import FotoPerfilUploader from '../FotoPerfilUploader';
import { useEffect, useState } from 'react';
import { URL_BACKEND } from '@env';
import { Snackbar } from 'react-native-paper';
import { colores } from '../styles/fuentesyColores';
import DateTimePicker from '@react-native-community/datetimepicker';

const { height } = Dimensions.get('window');

const PerfilMaestro = ({ navigation }) => {
    const usuario = useSelector(state => state.usuario);
    const dispatch = useDispatch();
    const [perfil, setPerfil] = useState(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('ok');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        address: '',
        graduationDate: '',
        competitionNumber: '',
        isEffectiveTeacher: false,
        healthCertificateStatus: false,
        criminalRecordDate: '',
        law19889CertificateDate: '',
        preferredShifts: [],
    });
    const [showGraduationDatePicker, setShowGraduationDatePicker] = useState(false);
    const [showLaw19889DatePicker, setShowLaw19889DatePicker] = useState(false);
    const [showCriminalRecordDatePicker, setShowCriminalRecordDatePicker] = useState(false);

    const showSnackbar = (message, type = 'ok') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
    };

    useEffect(() => {
        const fetchPerfil = async () => {
            const token = await SecureStore.getItemAsync('token');
            const resp = await fetch(`${URL_BACKEND}/v1/users/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            try {
                const data = await resp.json();
                setPerfil(data);
            } catch (e) {
                showSnackbar('Error al cargar el perfil', 'error');
            }
        };
        fetchPerfil();
    }, []);

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("isLogged");
        await SecureStore.deleteItemAsync("usuario");
        dispatch(desloguear());
    };

    const startEdit = () => {
        setEditData({
            address: perfil?.teacherProfile?.address || '',
            graduationDate: perfil?.teacherProfile?.graduationDate ? perfil.teacherProfile.graduationDate.slice(0, 10) : '',
            competitionNumber: perfil?.teacherProfile?.competitionNumber?.toString() || '',
            isEffectiveTeacher: perfil?.teacherProfile?.isEffectiveTeacher || false,
            healthCertificateStatus: perfil?.teacherProfile?.healthCertificateStatus || false,
            criminalRecordDate: perfil?.teacherProfile?.criminalRecordDate ? perfil.teacherProfile.criminalRecordDate.slice(0, 10) : '',
            law19889CertificateDate: perfil?.teacherProfile?.law19889CertificateDate ? perfil.teacherProfile.law19889CertificateDate.slice(0, 10) : '',
            preferredShifts: perfil?.teacherProfile?.preferredShifts || [],
        });
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setIsEditing(false);
    };

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const toggleShift = (shift) => {
        setEditData(prev => {
            const arr = prev.preferredShifts.includes(shift)
                ? prev.preferredShifts.filter(s => s !== shift)
                : [...prev.preferredShifts, shift];
            return { ...prev, preferredShifts: arr };
        });
    };

    const handleSaveEdit = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const body = {
                address: editData.address,
                graduationDate: editData.graduationDate || undefined,
                competitionNumber: editData.competitionNumber ? Number(editData.competitionNumber) : undefined,
                isEffectiveTeacher: editData.isEffectiveTeacher,
                healthCertificateStatus: editData.healthCertificateStatus,
                criminalRecordDate: editData.criminalRecordDate || undefined,
                law19889CertificateDate: editData.law19889CertificateDate || undefined,
                preferredShifts: editData.preferredShifts,
            };
            const resp = await fetch(`${URL_BACKEND}/v1/users/profileTeacher`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });
            if (!resp.ok) {
                const err = await resp.json();
                showSnackbar(err.message || 'Error al actualizar', 'error');
                return;
            }
            showSnackbar('Datos actualizados correctamente', 'ok');
            setIsEditing(false);
            const updated = await resp.json();
            setPerfil(updated);
        } catch (e) {
            showSnackbar('Error al actualizar', 'error');
        }
    };

    // mostrar la fecha en DD/MM/YYYY
    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    // guardar la fecha en YYYY-MM-DD
    const formatDateSave = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleGraduationDateChange = (event, selectedDate) => {
        setShowGraduationDatePicker(false);
        if (selectedDate) {
            handleEditChange('graduationDate', formatDateSave(selectedDate));
        }
    };
    const handleLaw19889DateChange = (event, selectedDate) => {
        setShowLaw19889DatePicker(false);
        if (selectedDate) {
            handleEditChange('law19889CertificateDate', formatDateSave(selectedDate));
        }
    };
    const handleCriminalRecordDateChange = (event, selectedDate) => {
        setShowCriminalRecordDatePicker(false);
        if (selectedDate) {
            handleEditChange('criminalRecordDate', formatDateSave(selectedDate));
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={stylesPerfil.encabezado}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={stylesPerfil.botonAtras}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={stylesPerfil.textoEncabezado}>Perfil</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <View style={stylesPerfil.contenedor}>
                        <ScrollView contentContainerStyle={stylesPerfil.contenidoScroll}>
                            <View style={stylesPerfil.avatarContainer}>
                                <FotoPerfilUploader
                                    avatarStyle={stylesPerfil.avatar}
                                    ciUsuario={usuario.ci}
                                    profilePhoto={perfil?.profilePhoto}
                                    onSnackbarMessage={(msg, type) => showSnackbar(msg, type)}
                                />
                                <View>
                                    <Text style={stylesPerfil.nombre}>{usuario.name} {usuario.lastName}</Text>
                                    <Text style={stylesPerfil.rol}>Maestro/a</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={stylesPerfil.tituloSeccion}>Tus Datos</Text>
                                <View style={stylesPerfil.datosSeccion}>
                                    <Text style={stylesPerfil.subtituloCampo}>Email</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="email" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        <Text style={stylesPerfil.textoFila}>{usuario.email || 'correo@dominio.com'}</Text>
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Teléfono de contacto</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="phone" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        <Text style={stylesPerfil.textoFila}>{usuario.phoneNumber || '+59892654987'}</Text>
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>C.I.</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="badge" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        <Text style={stylesPerfil.textoFila}>{usuario.ci || '49086546'}</Text>
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Dirección</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="location-on" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <TextInput
                                                value={editData.address}
                                                onChangeText={t => handleEditChange('address', t)}
                                                style={stylesPerfil.textoFilaEditable}
                                            />
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.address}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Fecha de egreso</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="event" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <>
                                                <TouchableOpacity
                                                    style={stylesPerfil.selectorFecha}
                                                    onPress={() => setShowGraduationDatePicker(true)}
                                                >
                                                    <Text style={stylesPerfil.textoFecha}>
                                                        {editData.graduationDate ? formatDateDisplay(editData.graduationDate) : 'Seleccione una fecha...'}
                                                    </Text>
                                                    <MaterialIcons name="event" size={24} color="#009fe3" />
                                                </TouchableOpacity>
                                                {showGraduationDatePicker && (
                                                    <DateTimePicker
                                                        value={editData.graduationDate ? new Date(editData.graduationDate) : new Date()}
                                                        mode="date"
                                                        display="default"
                                                        onChange={handleGraduationDateChange}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.graduationDate?.slice(0, 10)}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Puntaje del concurso</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="assignment" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <TextInput
                                                value={editData.competitionNumber}
                                                onChangeText={t => handleEditChange('competitionNumber', t)}
                                                style={stylesPerfil.textoFilaEditable}
                                                keyboardType="numeric"
                                            />
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.competitionNumber}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Efectividad</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="account-balance" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <Switch
                                                value={editData.isEffectiveTeacher}
                                                onValueChange={v => handleEditChange('isEffectiveTeacher', v)}
                                            />
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.isEffectiveTeacher ? 'Efectivo' : 'No Efectivo'}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Carné de Salud</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="health-and-safety" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <Switch
                                                value={editData.healthCertificateStatus}
                                                onValueChange={v => handleEditChange('healthCertificateStatus', v)}
                                            />
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.healthCertificateStatus ? 'Vigente' : 'No vigente'}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Certificado Ley 19889</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="description" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <>
                                                <TouchableOpacity
                                                    style={stylesPerfil.selectorFecha}
                                                    onPress={() => setShowLaw19889DatePicker(true)}
                                                >
                                                    <Text style={stylesPerfil.textoFecha}>
                                                        {editData.law19889CertificateDate ? formatDateDisplay(editData.law19889CertificateDate) : 'Seleccione una fecha...'}
                                                    </Text>
                                                    <MaterialIcons name="event" size={24} color="#009fe3" />
                                                </TouchableOpacity>
                                                {showLaw19889DatePicker && (
                                                    <DateTimePicker
                                                        value={editData.law19889CertificateDate ? new Date(editData.law19889CertificateDate) : new Date()}
                                                        mode="date"
                                                        display="default"
                                                        onChange={handleLaw19889DateChange}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.law19889CertificateDate?.slice(0, 10)}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Fecha Antecedentes Penales</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="description" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <>
                                                <TouchableOpacity
                                                    style={stylesPerfil.selectorFecha}
                                                    onPress={() => setShowCriminalRecordDatePicker(true)}
                                                >
                                                    <Text style={stylesPerfil.textoFecha}>
                                                        {editData.criminalRecordDate ? formatDateDisplay(editData.criminalRecordDate) : 'Seleccione una fecha...'}
                                                    </Text>
                                                    <MaterialIcons name="event" size={24} color="#009fe3" />
                                                </TouchableOpacity>
                                                {showCriminalRecordDatePicker && (
                                                    <DateTimePicker
                                                        value={editData.criminalRecordDate ? new Date(editData.criminalRecordDate) : new Date()}
                                                        mode="date"
                                                        display="default"
                                                        onChange={handleCriminalRecordDateChange}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.criminalRecordDate?.slice(0, 10)}</Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Turnos Preferidos</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <MaterialIcons name="schedule" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        {isEditing ? (
                                            <View style={{ flexDirection: 'row' }}>
                                                {['MORNING', 'AFTERNOON', 'FULL_DAY'].map(shift => (
                                                    <TouchableOpacity
                                                        key={shift}
                                                        onPress={() => toggleShift(shift)}
                                                        style={{
                                                            padding: 6, margin: 2, borderWidth: 1,
                                                            borderColor: editData.preferredShifts.includes(shift) ? '#009fe3' : '#ccc',
                                                            borderRadius: 6, backgroundColor: editData.preferredShifts.includes(shift) ? '#009fe3' : '#fff'
                                                        }}
                                                    >
                                                        <Text style={{ color: editData.preferredShifts.includes(shift) ? '#fff' : '#000' }}>
                                                            {shift === 'MORNING' ? 'Mañana' : shift === 'AFTERNOON' ? 'Tarde' : 'Completo'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        ) : (
                                            <Text style={stylesPerfil.textoFila}>
                                                {(perfil?.teacherProfile?.preferredShifts || []).map(s =>
                                                    s === 'MORNING' ? 'Mañana' : s === 'AFTERNOON' ? 'Tarde' : 'Completo'
                                                ).join(', ')}
                                            </Text>
                                        )}
                                    </View>
                                    <Text style={stylesPerfil.subtituloCampo}>Calificación</Text>
                                    <View style={stylesPerfil.filaSeccion}>
                                        <FontAwesome name="star" size={20} color="#009fe3" style={stylesPerfil.iconoFila} />
                                        <Text style={stylesPerfil.textoFila}>{perfil?.teacherProfile?.rating}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={stylesPerfil.contenedorBotones}>
                                {!isEditing ? (
                                    <TouchableOpacity style={stylesPerfil.botonEditar} onPress={startEdit}>
                                        <Text style={stylesPerfil.textoBotonEditar}>Editar Datos</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <>
                                        <TouchableOpacity style={stylesPerfil.botonEditar} onPress={handleSaveEdit}>
                                            <Text style={stylesPerfil.textoBotonEditar}>Guardar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={stylesPerfil.botonCerrarSesion} onPress={cancelEdit}>
                                            <Text style={stylesPerfil.textoCerrarSesion}>Cancelar</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {!isEditing && (
                                    <TouchableOpacity style={stylesPerfil.botonCerrarSesion} onPress={handleLogout}>
                                        <Text style={stylesPerfil.textoCerrarSesion}>Cerrar Sesión</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={4000}
                style={{
                    backgroundColor: snackbarType === 'ok' ? colores.cartelExito : colores.cartelError,
                    marginBottom: height * 0.05,
                }}
            >
                <Text style={{
                    color: snackbarType === 'ok' ? colores.letrasExito : colores.letrasError,
                    fontWeight: 'bold'
                }}>
                    {snackbarMessage}
                </Text>
            </Snackbar>
        </View>
    );
};

export default PerfilMaestro;
