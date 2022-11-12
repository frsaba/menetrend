import { RowDataPacket } from "mysql2"

export interface IJarat extends RowDataPacket {
  jaratszam: string,
  tipus: number
}