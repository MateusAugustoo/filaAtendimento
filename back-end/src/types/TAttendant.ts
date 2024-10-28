export type TAttendant = {
  name: string,
  cpf: string,
  password: string,
  typeService?: string,
  role: "attendant" | "admin"
}

export type TLogin = {
  property: string,
  password: string
}