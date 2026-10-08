import bcrypt from 'bcrypt';
export const hash = async (
  plainText: string,
  salt = Number(process.env.SALT),
): Promise<string> => {
  return await bcrypt.hash(plainText, salt);
};
export const compareHash = async (
  plainText: string,
  hashData: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainText, hashData);
};
