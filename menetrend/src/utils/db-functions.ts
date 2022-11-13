import axios from "axios"

export async function get(path: string, params?: object) {
	
	let response = await axios.get(import.meta.env.VITE_API_URL + "/" + path, { params : params })

	// console.log(response);
	return response.data;
}