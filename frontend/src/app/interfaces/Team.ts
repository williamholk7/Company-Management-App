import { BasicUser } from "./User";

export interface Team {
  id: number | null,
  name: string,
  description: string,
  teammates: BasicUser[]
}
