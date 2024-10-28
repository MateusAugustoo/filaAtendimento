import { $Enums } from "@prisma/client"

export type TPass = {
  password: string
  status: $Enums.PasswordStatus
  typeService?: string | null
}