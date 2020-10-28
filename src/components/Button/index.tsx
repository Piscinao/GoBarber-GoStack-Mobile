import React from 'react';
import {RectButtonProperties} from 'react-native-gesture-handler';
import {Container, ButtonText} from './styles';

interface ButtonProps extends RectButtonProperties {
  // por padrao o children é qualquer coisa e ja vem setado
  children: string;
}
// ...rest forcei pegar todas as propriedades
const Button: React.FC<ButtonProps> = ({children, ...rest}) => (
  <Container {...rest}>
    <ButtonText>{children}</ButtonText>
  </Container>
);

export default Button;
