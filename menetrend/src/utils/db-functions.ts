import { IVehicleTypeInfo } from "@/types";
import axios from "axios"

export async function get(path: string, params?: any) {

	let response = await axios.get(import.meta.env.VITE_API_URL + "/" + path, { params: params })

	// console.log(response);
	return response.data;
}

var vehicle_types_cache: IVehicleTypeInfo[];
var route_colors_cache: { [key: string]: string } = {}



async function update_route_colors_cache() {
	route_colors_cache = {};
	let color_pairs: [{ jaratszam: string, szin: string }] = await get("routecolors")

	for (let pair of color_pairs) {
		route_colors_cache[pair.jaratszam] = "#" + pair.szin
	}
}
await update_route_colors_cache();

export async function get_route_color(route?: string) {

	if (route == undefined) return "#000000"
	if( !(route in route_colors_cache) )
		await update_route_colors_cache();

	return route_colors_cache[route];
}

export async function post(path: string, body: object) {
	let response = await axios.post(import.meta.env.VITE_API_URL + "/" + path, body)
	return response.data;
}

