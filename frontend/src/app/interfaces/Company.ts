import { Team } from "./Team";
import { BasicUser } from "./User";

export interface Company {
  id: number,
  name: string,
  description: string,
  teams: Team[],
  users: BasicUser[]
}
