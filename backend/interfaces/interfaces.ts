import { RowDataPacket } from "mysql2"

export interface IJarat extends RowDataPacket {
  jaratszam: string,
  tipus: number
}

export interface IStopInfo {
	megallonev: string
	cim: string
	jaratok? : string[]
	befogad? : string[]

  }

  export interface IDensityInfo {
    ora: number,
    tipus: string,
    db: number
  }

  export interface IRouteLengthInfo{
    jaratszam: string,
    hossz: number
    tipus: string
  }