import generate from "nanoid/generate";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ID_LENGTH = 21;

export default () => generate(alphabet, ID_LENGTH);
