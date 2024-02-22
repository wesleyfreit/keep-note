import validate from 'deep-email-validator';

export const emailValidator = async (email: string) => {
  return await validate({ email, validateSMTP: false });
};
