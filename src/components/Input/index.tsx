import React, {useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
// useImperativeHandle passa uma função do componente filho para o componente pai
import {TextInputProps} from 'react-native';
import {useField} from '@unform/core';

import {Container, TextInput, Icon} from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

//ref é uma propriedade que não pode acessar como prop comum do elemento
const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  {name, icon, ...rest},
  ref,
) => {
  const inputElementRef = useRef<any>(null);

  const {registerField, defaultValue = '', fieldName, error} = useField(name);
  const inputValueRef = useRef<InputValueReference>({value: 'defaultValue'});

  // metodo dentro de um componente filho *componente pai é o input
  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({text: value});
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);
  return (
    <Container>
      <Icon name={icon} size={20} color="#666360" />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        defaultValue={defaultValue}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

// chama a função fowardRef para funcionar o inputElementRer (acessar um elemento filho pelo componente pai)
export default forwardRef(Input);
