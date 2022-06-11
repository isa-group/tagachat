import { UserRoles } from 'src/utils/enums/userRoles'

export type IUser = {
  _id: string
  email: string
  name: string
  role: UserRoles.REVIEWER | UserRoles.ADMIN
  isActive: boolean
}
