import {ValidationError} from 'yup';

// Tipagem dinâmico a chave do objeto pode ser qualquer coisa desde que seja o tipo
// Pois vai ter situações em que os campo são diferentes
interface Errors {
  [key: string]: string;
}
export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  // Percorre o array no forEach apra cada erro pega a validationErrors
  // Cria um propriedade com o nome path e o valor é a mensagem
  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
