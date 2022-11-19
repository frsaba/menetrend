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
}

export interface IStopCompatibility{
	megallonev : string,
	vehicle_type_id: number
}