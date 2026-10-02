// 访客地理定位接口（路由：/api/geo）
// EdgeOne 边缘节点自带访客 GEO 信息（request.eo），无需调用任何第三方服务、无需密钥
// 返回访客所在市/省/国家与经纬度，供前端查询 Open-Meteo 天气
export function onRequest({ request }) {
	const eo = request.eo || {};
	const geo = eo.geo || {};

	const body = JSON.stringify({
		city: geo.cityName || "",
		region: geo.regionName || "",
		country: geo.countryName || "",
		lat: typeof geo.latitude === "number" ? geo.latitude : null,
		lon: typeof geo.longitude === "number" ? geo.longitude : null,
	});

	return new Response(body, {
		headers: {
			"content-type": "application/json; charset=UTF-8",
			"Access-Control-Allow-Origin": "*",
			// 每个访客的结果都不同，禁止任何环节缓存
			"Cache-Control": "no-store",
		},
	});
}
