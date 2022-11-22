export interface IVehicleTypeInfo{
	id: number,
	nev: string,
	szin: string
}

export interface IRouteNumber{
	jaratszam : string
}

export interface IStopInfo{
	megallonev : string,
	cim : string,
	jaratok? : string[]
	befogad? : string[]
}

export interface IStopCompatibility{
	megallonev : string,
	vehicle_type_id: number
}

export interface IDepartureInfo{
	ora : number,
	perc : number,
	irany: number,
	originalIndex? : number
}

export interface IArrivalInfo{
	megallo: string,
	erkezes: number
}