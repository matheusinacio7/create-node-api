import ErrorWithCode from './ErrorWithCode';

module.exports = class NotFoundError extends ErrorWithCode {
    constructor(message: string) {
    super({ message, code: 'not_found' });
  }
};
