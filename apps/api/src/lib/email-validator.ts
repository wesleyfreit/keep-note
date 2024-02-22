import validate from 'deep-email-validator';

export const emailValidator = async (email: string) => {
  let validateSMTP = true;

  const domain = email.split('@')[1];

  const isMicrosoftDomain = domain
    ? /(hotmail|outlook)\.com(\.br)?$/.test(domain)
    : false;

  if (isMicrosoftDomain) {
    validateSMTP = false;
  }

  return await validate({ email, validateSMTP });
};
