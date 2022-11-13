import { IVehicleTypeInfo } from "@/types";
import axios from "axios"

export async function get(path: string, params?: any) {

	let response = await axios.get(import.meta.env.VITE_API_URL + "/" + path, { params: params })

	// console.log(response);
	return response.data;
}

var vehicle_types_cache: IVehicleTypeInfo[];
var route_colors_cache: { [key: string]: string } = {}

let color_pairs: [{ jaratszam: string, szin: string }] = await get("routecolors")

for (let pair of color_pairs) {
	route_colors_cache[pair.jaratszam] = "#" + pair.szin
}

export async function get_route_color(route?: string) {

	if (route == undefined) return "#000000"

	return route_colors_cache[route];
}

