import { View } from 'react-native';
import FormularioLogin from './FormularioLogin';

const Login = ({ navigation }) => {
  return (
    <View>
      <FormularioLogin navigation={navigation} />
    </View>
  );
};

export default Login;