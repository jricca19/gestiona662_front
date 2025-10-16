import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { estilosHome } from '../styles/stylesHome';
import * as SecureStore from 'expo-secure-store';
import { URL_BACKEND } from '@env';

const HomeDirector = ({ navigation }) => {
    const { name, lastName } = useSelector(state => state.usuario);
    const [escuelas, setEscuelas] = useState([]);
    const [escuelaSeleccionada, setEscuelaSeleccionada] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        cargarEscuelas();
    }, []);

    const cargarEscuelas = async () => {
        try {
            const token = await SecureStore.getItemAsync('token')
            setLoading(true);
            const response = await fetch(`${URL_BACKEND}/v1/schools/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            const data = await response.json();
            setEscuelas(data || []);
            if (data && data.length > 0) {
                setEscuelaSeleccionada(data[0]._id);
            } else {
                setEscuelaSeleccionada('');
            }
        } catch (error) {
            console.error('Error al cargar escuelas:', error);
        }
        setLoading(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={estilosHome.encabezado}>
                <Text style={estilosHome.textoEncabezado}>Gestiona 662</Text>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
                <View style={estilosHome.contenedor}>
                    <View>
                        <View style={estilosHome.bienvenida}>
                            <Text style={estilosHome.bienvenidaContenido}>Bienvenid@</Text>
                            <Text style={estilosHome.bienvenidaContenido}>{`${name} ${lastName}`}</Text>
                        </View>
                        <View>
                            <Text style={estilosHome.tituloSeccion}>Tus Escuelas</Text>
                            <View style={estilosHome.escuelasContainer}>
                                <View style={estilosHome.filaEscuelaInput}>
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#009fe3" />
                                    ) : (
                                        <Picker
                                            selectedValue={escuelaSeleccionada}
                                            onValueChange={(itemValue) => setEscuelaSeleccionada(itemValue)}
                                            style={estilosHome.picker}
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
                        </View>

                    </View>
                    <View style={estilosHome.contenedorIndicadores}>
                        <View style={estilosHome.filaIndicadores}>
                            <View style={estilosHome.indicadorYEtiqueta}>
                                <View style={estilosHome.indicador}>
                                    <MaterialIcons name="event-note" size={40} color="#009fe3" />
                                    <Text style={estilosHome.numeroIndicador}>4</Text>
                                </View>
                                <Text style={estilosHome.etiquetaIndicador}>Publicaciones{"\n"}Activas</Text>
                            </View>
                            <View style={estilosHome.indicadorYEtiqueta}>
                                <View style={estilosHome.indicador}>
                                    <MaterialIcons name="warning" size={40} color="#009fe3" />
                                    <Text style={estilosHome.numeroIndicador}>1</Text>
                                </View>
                                <Text style={estilosHome.etiquetaIndicador}>Próximas a{"\n"}Vencer</Text>
                            </View>
                        </View>
                        <View style={estilosHome.filaIndicadores}>
                            <View style={estilosHome.indicadorYEtiqueta}>
                                <View style={estilosHome.indicador}>
                                    <MaterialIcons name="pending-actions" size={40} color="#009fe3" />
                                    <Text style={estilosHome.numeroIndicador}>2</Text>
                                </View>
                                <Text style={estilosHome.etiquetaIndicador}>Selección{"\n"}Pendiente</Text>
                            </View>
                            <View style={estilosHome.indicadorYEtiqueta}>
                                <View style={estilosHome.indicador}>
                                    <MaterialIcons name="verified" size={40} color="#009fe3" />
                                    <Text style={estilosHome.numeroIndicador}>6</Text>
                                </View>
                                <Text style={estilosHome.etiquetaIndicador}>Concretadas</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeDirector;
