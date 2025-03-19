import bcrypt from "bcrypt";


export const hashValue = async (value: string, saltRound?: number) =>
    bcrypt.hash(value, saltRound || 10)

export const compareValue = async (value: string, hashedValue: string): Promise<boolean> =>
    bcrypt.compare(value, hashedValue).catch(() => { return false })