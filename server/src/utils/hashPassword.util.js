import * as bcrypt from "bcrypt";

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
}

export { hashPassword };
