import bcrypt from 'bcrypt'

export async function hasPassword(password: string){
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

export async function checkPassword(password: string, hash: string){
  const isMatch = await bcrypt.compare(password, hash)

  return isMatch
}