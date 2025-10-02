import { View} from 'react-native';
import FormularioRegistro from './FormularioRegistro';

const Registro = ({ navigation }) => {
  return (
    <View>
      <FormularioRegistro navigation={navigation} />
    </View>
  );
};

export default Registro;