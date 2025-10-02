import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { estilosModalBusqueda } from '../styles/stylesModalBusquedaPublicaciones';
import { URL_BACKEND } from '@env';

const ModalBusquedaPublicaciones = ({ visible, onClose, onApplyFilters, onClearFilters }) => {
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
    const [escuelaSeleccionada, setEscuelaSeleccionada] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const [departamentos, setDepartamentos] = useState([]);
    const [escuelas, setEscuelas] = useState([]);

    useEffect(() => {
        if (visible) {
            cargarDepartamentos();
            cargarEscuelas();
        }
    }, [visible]);

    const cargarDepartamentos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${URL_BACKEND}/departments`, {
                method: 'GET',
            });
            const data = await response.json();
            setDepartamentos(data || []);
        } catch (error) {
            console.error('Error al cargar departamentos:', error);
        }
        setLoading(false);
    };

    const cargarEscuelas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${URL_BACKEND}/schoolsSelect`);
            const data = await response.json();
            setEscuelas(data || []);
        } catch (error) {
            console.error('Error al cargar escuelas:', error);
        }
        setLoading(false);
    };

    const aplicarFiltros = async () => {
        const filtros = {
            departmentName: departamentoSeleccionado || null,
            schoolId: escuelaSeleccionada || null,
            startDate: fechaSeleccionada ? fechaSeleccionada.toISOString().split('T')[0] : null
        };
        onApplyFilters(filtros);
        onClose();
    };

    const limpiarFiltros = () => {
        setDepartamentoSeleccionado('');
        setEscuelaSeleccionada('');
        setFechaSeleccionada(null);
        if (onClearFilters) {
            onClearFilters();
        }
        onClose();
    };

    const onDateChange = (event, selectedDate) => {
        setMostrarDatePicker(false);
        if (selectedDate) {
            setFechaSeleccionada(selectedDate);
        }
    };

    const formatearFecha = (fecha) => {
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={estilosModalBusqueda.overlay}>
                <View style={estilosModalBusqueda.contenedorModal}>
                    <View style={estilosModalBusqueda.header}>
                        <Text style={estilosModalBusqueda.tituloModal}>Filtros</Text>
                        <TouchableOpacity onPress={onClose} style={estilosModalBusqueda.botonCerrar}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={estilosModalBusqueda.contenidoScroll}>
                        <View style={estilosModalBusqueda.contenedorCampo}>
                            <View style={estilosModalBusqueda.selectorContainer}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#009fe3" />
                                ) : (
                                    <Picker
                                        selectedValue={departamentoSeleccionado}
                                        onValueChange={(itemValue) => setDepartamentoSeleccionado(itemValue)}
                                        style={estilosModalBusqueda.picker}
                                    >
                                        <Picker.Item label="Seleccione departamento..." value="" />
                                        {departamentos.map((dept, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={dept.name || dept}
                                                value={dept.name || dept}
                                            />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                        </View>

                        <View style={estilosModalBusqueda.contenedorCampo}>
                            <View style={estilosModalBusqueda.selectorContainer}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#009fe3" />
                                ) : (
                                    <Picker
                                        selectedValue={escuelaSeleccionada}
                                        onValueChange={(itemValue) => setEscuelaSeleccionada(itemValue)}
                                        style={estilosModalBusqueda.picker}
                                    >
                                        <Picker.Item label="Seleccione escuela..." value="" />
                                        {escuelas.map((escuela) => (
                                            <Picker.Item
                                                key={escuela._id}
                                                label={`Esc. ${escuela.schoolNumber} - ${escuela.cityName}`}
                                                value={escuela._id}
                                            />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                        </View>

                        <Text style={estilosModalBusqueda.tituloBuscarDesde}>Buscar desde</Text>
                        <View style={estilosModalBusqueda.contenedorCampo}>
                            <TouchableOpacity
                                style={estilosModalBusqueda.selectorFecha}
                                onPress={() => setMostrarDatePicker(true)}
                            >
                                <Text style={estilosModalBusqueda.textoFecha}>
                                    {fechaSeleccionada
                                        ? formatearFecha(fechaSeleccionada)
                                        : 'Seleccione una fecha...'}
                                </Text>
                                <MaterialIcons name="event" size={24} color="#009fe3" />
                            </TouchableOpacity>
                        </View>
                        {mostrarDatePicker && (
                            <DateTimePicker
                                value={fechaSeleccionada || new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        <View style={estilosModalBusqueda.contenedorBotones}>
                            <TouchableOpacity
                                style={estilosModalBusqueda.botonAplicar}
                                onPress={aplicarFiltros}
                            >
                                <Text style={estilosModalBusqueda.textoBotonAplicar}>
                                    Aplicar Filtros
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={estilosModalBusqueda.botonLimpiar}
                                onPress={limpiarFiltros}
                            >
                                <Text style={estilosModalBusqueda.textoBotonLimpiar}>
                                    Limpiar Filtros
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ModalBusquedaPublicaciones;
