import { BasicUser } from "./User"

export interface Announcement {
  id: number
  date: string
  title: string
  message: string
  author: BasicUser
}
