import { Company } from "./Company"
import { Profile } from "./Profile"
import { Team } from "./Team"

export interface FullUser {
  id: number
  profile: Profile
  admin: boolean
  active: boolean
  status: string
  companies: Company[],
  teams: Team[],
}

export interface BasicUser {
  id: number
  profile: Profile
  isAdmin: boolean
  active: boolean
  status: string
}
