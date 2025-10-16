import { Text, View, TextInput, Alert, Modal, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { loguear } from '../store/slices/usuarioSlice';
import { stylesRegistro } from './styles/stylesRegistro';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState, useCallback } from 'react';
import { colores } from './styles/fuentesyColores';
import { URL_BACKEND } from '@env';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(20, 'El nombre no puede tener más de 20 caracteres'),
  lastName: yup
    .string()
    .required('El apellido es obligatorio')
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .max(20, 'El apellido no puede tener más de 20 caracteres'),
  ci: yup.string().required('La cédula es obligatoria'),
  email: yup.string().email('Email inválido').required('El email es obligatorio'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
  phoneNumber: yup.string().required('El teléfono es obligatorio'),
  role: yup.string().oneOf(['STAFF', 'TEACHER'], 'Rol inválido').required(),
  aceptarTerminos: yup
    .bool()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
});

const Registro = ({ navigation }) => {
  const dispatch = useDispatch();
  const [escuelas, setEscuelas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [defaultDeptId, setDefaultDeptId] = useState('');
  const [newSchoolNumber, setNewSchoolNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [ciudades, setCiudades] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const cargarCiudades = async () => {
      if (modalVisible && defaultDeptId) {
        try {
          const res = await fetch(`${URL_BACKEND}/departments/${defaultDeptId}`);
          const data = await res.json();
          setCiudades(data || []);
        } catch (error) {
          console.error("Error al cargar ciudades por defecto:", error);
          setCiudades([]);
        }
      }
    };
    cargarCiudades();
  }, [modalVisible, defaultDeptId]);

  const handleCreateSchool = async () => {
    if (!newSchoolNumber || !selectedCity || !newAddress || !defaultDeptId) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    try {
      const res = await fetch(`${URL_BACKEND}/schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolNumber: newSchoolNumber,
          cityName: selectedCity,
          address: newAddress,
          departmentId: defaultDeptId,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al crear escuela');
      }

      const createdSchool = data.school;
      setEscuelas((prev) => [...prev, createdSchool]);
      setValue("schoolId", createdSchool._id);
      setModalVisible(false);
      setNewSchoolNumber('');
      setNewAddress('');
      setSelectedCity('');
    } catch (err) {
      console.error("Error al crear escuela:", err);
      Alert.alert("Error", err.message || "Error al crear escuela");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadIonicons = async () => {
      try {
        await Ionicons.loadFont();

        const [resEscuelas, resDeptos] = await Promise.all([
          fetch(`${URL_BACKEND}/schoolsSelect`),
          fetch(`${URL_BACKEND}/departments`),
        ]);

        const escuelasData = await resEscuelas.json();
        const departamentosData = await resDeptos.json();

        if (!isMounted) return;

        setEscuelas(escuelasData);
        setDepartamentos(departamentosData);

        if (departamentosData.length > 0) {
          setDefaultDeptId(departamentosData[0]._id);
        }

      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };
    loadIonicons();
    return () => { isMounted = false; };
  }, []);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      lastName: '',
      ci: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      schoolId: '',
      role: 'STAFF',
      aceptarTerminos: false
    },
  });

  const irALogin = () => {
    navigation.replace("login");
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    const { confirmPassword, aceptarTerminos, schoolId, ...rest } = formData;

    const dataToSend = {
      ...rest,
      ...(formData.role === 'STAFF' && { schoolId }),
    };

    try {
      const response = await fetch(`${URL_BACKEND}/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.status === 201) {
        await SecureStore.setItemAsync("token", data.token);
        await SecureStore.setItemAsync("isLogged", "true");

        const profileResp = await fetch(`${URL_BACKEND}/v1/users/profile`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json',
          }
        });

        const profile = await profileResp.json();

        const usuario = {
          name: profile.name,
          lastName: profile.lastName,
          email: profile.email,
          role: profile.role,
          ci: profile.ci,
          phoneNumber: profile.phoneNumber,
        };

        await SecureStore.setItemAsync("usuario", JSON.stringify(usuario));
        dispatch(loguear(usuario));

        Alert.alert('Éxito', 'Se ha registrado el usuario correctamente');
      } else {
        Alert.alert('Error', data?.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <View style={stylesRegistro.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colores.primario} />
        </View>
      </View>
    );
  }

  return (
    <View style={stylesRegistro.container}>
      <View style={stylesRegistro.encabezadoConFlecha}>
        <View style={stylesRegistro.iconoAtrasWrapper}>
          <TouchableOpacity onPress={irALogin}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={stylesRegistro.textoEncabezadoConFlecha}>Registro</Text>
      </View>
      <KeyboardAvoidingView
        style={stylesRegistro.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={stylesRegistro.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={stylesRegistro.content}>
            <Text style={stylesRegistro.titulo}>Tus datos</Text>
            <Text style={stylesRegistro.label}>Nombre</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="person-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={stylesRegistro.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Nombre"
                      placeholderTextColor={colores.tercearioOscuro}
                    />
                  )}
                />
              </View>
              {errors.name && <Text style={stylesRegistro.error}>{errors.name.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Apellido</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="person-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={stylesRegistro.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Apellido"
                      placeholderTextColor={colores.tercearioOscuro}
                    />
                  )}
                />
              </View>
              {errors.lastName && <Text style={stylesRegistro.error}>{errors.lastName.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Cédula de Identidad</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="card-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <Controller
                  control={control}
                  name="ci"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={stylesRegistro.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Cédula de Identidad"
                      placeholderTextColor={colores.tercearioOscuro}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              {errors.ci && <Text style={stylesRegistro.error}>{errors.ci.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Email</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="mail-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={stylesRegistro.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Email"
                      placeholderTextColor={colores.tercearioOscuro}
                    />
                  )}
                />
              </View>
              {errors.email && <Text style={stylesRegistro.error}>{errors.email.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Contraseña</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="lock-closed-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <View style={{ flex: 1, position: 'relative' }}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={stylesRegistro.input}
                        placeholder="Contraseña"
                        placeholderTextColor={colores.tercearioOscuro}
                        secureTextEntry={!mostrarPassword}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: [{ translateY: -12 }],
                    }}
                    onPress={() => setMostrarPassword(!mostrarPassword)}
                  >
                    <Ionicons
                      name={mostrarPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={colores.primario}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {errors.password && <Text style={stylesRegistro.error}>{errors.password.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Confirmar contraseña</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="lock-closed-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <View style={{ flex: 1, position: 'relative' }}>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={stylesRegistro.input}
                        placeholder="Confirmar contraseña"
                        placeholderTextColor={colores.tercearioOscuro}
                        secureTextEntry={!mostrarConfirmPassword}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: [{ translateY: -12 }],
                    }}
                    onPress={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                  >
                    <Ionicons
                      name={mostrarConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      color={colores.primario}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {errors.confirmPassword && <Text style={stylesRegistro.error}>{errors.confirmPassword.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Teléfono</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="call-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={stylesRegistro.input}
                      value={value}
                      onChangeText={onChange}
                      placeholder="Teléfono"
                      placeholderTextColor={colores.tercearioOscuro}
                    />
                  )}
                />
              </View>
              {errors.phoneNumber && <Text style={stylesRegistro.error}>{errors.phoneNumber.message}</Text>}
            </View>
            <View style={{ height: 10 }} />
            <Text style={stylesRegistro.label}>Rol</Text>
            <View>
              <View style={stylesRegistro.filaIcono}>
                <Ionicons name="briefcase-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => onChange('STAFF')}
                        style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
                      >
                        <Ionicons name={value === 'STAFF' ? 'radio-button-on' : 'radio-button-off'} size={22} color={colores.primario} />
                        <Text style={{ marginLeft: 6 }}>STAFF</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => onChange('TEACHER')}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Ionicons name={value === 'TEACHER' ? 'radio-button-on' : 'radio-button-off'} size={22} color={colores.primario} />
                        <Text style={{ marginLeft: 6 }}>TEACHER</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
              {errors.role && <Text style={stylesRegistro.error}>{errors.role.message}</Text>}
            </View>
            <View style={{ height: 10 }} />

            {watch('role') === 'STAFF' && (
              <>
                <Text style={stylesRegistro.label}>Escuela</Text>
                <View style={[stylesRegistro.filaIcono, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Ionicons name="school-outline" size={24} color={colores.primario} style={stylesRegistro.iconSeparado} />
                  <Controller
                    control={control}
                    name="schoolId"
                    render={({ field: { onChange, value } }) => (
                      <View style={stylesRegistro.selectorContainer}>
                        <Picker
                          selectedValue={value}
                          onValueChange={onChange}
                          style={stylesRegistro.pickerEscuela}
                          dropdownIconColor={colores.primario}
                        >
                          <Picker.Item label="Selecciona una escuela" value="" />
                          {escuelas.map((escuela) => (
                            <Picker.Item
                              key={escuela._id}
                              label={`Esc. ${escuela.schoolNumber} - ${escuela.cityName}`}
                              value={escuela._id}
                            />
                          ))}
                        </Picker>
                      </View>
                    )}
                  />
                  <TouchableOpacity
                    style={stylesRegistro.botonAgregarEscuela}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={stylesRegistro.botonAgregarTexto}>+</Text>
                  </TouchableOpacity>
                </View>
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                  <View style={stylesRegistro.modalOverlay}>
                    <View style={stylesRegistro.modalContent}>
                      <Text style={stylesRegistro.modalTitle}>Agregar escuela</Text>
                      <TextInput
                        placeholder="Número de escuela..."
                        value={newSchoolNumber}
                        onChangeText={setNewSchoolNumber}
                        keyboardType="numeric"
                        style={stylesRegistro.inputModal}
                        placeholderTextColor={colores.tercearioOscuro}
                      />
                      <Text style={stylesRegistro.label}>Departamento</Text>
                      <View style={stylesRegistro.pickerWrapper}>
                        <Picker
                          style={stylesRegistro.pickerDptoyCiudad}
                          selectedValue={defaultDeptId}
                          onValueChange={async (deptId) => {
                            setDefaultDeptId(deptId);
                            setSelectedCity('');
                            try {
                              const res = await fetch(`${URL_BACKEND}/departments/${deptId}`);
                              const data = await res.json();
                              setCiudades(data || []);
                            } catch (error) {
                              console.error("Error al obtener ciudades del departamento:", error);
                              setCiudades([]);
                            }
                          }}
                        >
                          <Picker.Item label="Selecciona un departamento..." value="" />
                          {departamentos.map((dep) => (
                            <Picker.Item key={dep._id} label={dep.name} value={dep._id} />
                          ))}
                        </Picker>
                      </View>
                      {ciudades.length > 0 && (
                        <>
                          <Text style={stylesRegistro.label}>Ciudad</Text>
                          <View style={stylesRegistro.pickerWrapper}>
                            <Picker
                              style={stylesRegistro.pickerDptoyCiudad}
                              selectedValue={selectedCity}
                              onValueChange={(value) => setSelectedCity(value)}
                            >
                              <Picker.Item label="Selecciona una ciudad..." value="" />
                              {ciudades.map((city, index) => (
                                <Picker.Item key={index} label={city.name} value={city.name} />
                              ))}
                            </Picker>
                          </View>
                        </>
                      )}
                      <TextInput
                        placeholder="Dirección..."
                        value={newAddress}
                        onChangeText={setNewAddress}
                        style={stylesRegistro.inputModal}
                        placeholderTextColor={colores.tercearioOscuro}
                      />
                      <View style={stylesRegistro.modalButtons}>
                        <TouchableOpacity
                          style={stylesRegistro.modalButton}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={stylesRegistro.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={stylesRegistro.modalButton}
                          onPress={handleCreateSchool}
                        >
                          <Text style={stylesRegistro.modalButtonText}>Crear</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
                {errors.schoolId && <Text style={stylesRegistro.error}>{errors.schoolId.message}</Text>}
              </>
            )}

            <Controller
              control={control}
              name="aceptarTerminos"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={stylesRegistro.checkboxContainer}
                  onPress={() => onChange(!value)}
                >
                  <Ionicons
                    name={value ? 'checkbox-outline' : 'square-outline'}
                    size={24}
                    color={colores.primario}
                  />
                  <Text style={stylesRegistro.checkboxLabel}>Acepto los términos y condiciones</Text>
                </TouchableOpacity>
              )}
            />
            {errors.aceptarTerminos && (
              <Text style={stylesRegistro.error}>{errors.aceptarTerminos.message}</Text>
            )}

            <TouchableOpacity
              style={stylesRegistro.botonRegistrarse}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colores.cuarto} />
              ) : (
                <Text style={stylesRegistro.textoBotonRegistrarse}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Registro;