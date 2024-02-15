import validate from 'deep-email-validator';

export const emailValidator = async (email: string) => {
  let validateSMTP = true;

  if (email.split('@')[1] === 'hotmail.com') {
    validateSMTP = false;
  }

  return await validate({ email, validateSMTP });
};
