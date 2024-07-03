import { Team } from "./Team";

export interface Project {
  id: number,
  name: string,
  description: string,
  active: boolean,
  TeamDto: Team
}
