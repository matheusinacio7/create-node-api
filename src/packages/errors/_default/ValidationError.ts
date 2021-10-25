import ErrorWithCode from './ErrorWithCode';

module.exports = class ValidationError extends ErrorWithCode {
  constructor(message: string) {
    super({ message, code: 'invalid_data' });
  }
};
