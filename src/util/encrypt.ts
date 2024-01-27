import bcrypt from "bcryptjs";
import env from "_env";

const saltRounds = env.ENCRYPTION_SALT_ROUND;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const secret = env.ENCRYPTION_SECRET;
