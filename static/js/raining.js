let records=null;
fetch("https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization="+CWB_API_KEY).then((response)=>{
	return response.json();
}).then((data)=>{
	records=data.records;
	renderRaining(0);
});
function renderRaining(page){
	let startIndex=page*10;
	let endIndex=(page+1)*10;
	const container=document.querySelector("#raining");
	for(let i=startIndex;i<endIndex;i++){
		const station=records.Station[i];
		const item=document.createElement("div");
		item.className="station";
		const name=document.createElement("div");
		name.className="name";
		name.textContent=station.StationName+"、"+station.GeoInfo.TownName+"、"+station.GeoInfo.CountyName;
		const amount=document.createElement("amount");
		amount.className="amount";
		amount.textContent=station.RainfallElement.Now.Precipitation+" mm";
		item.appendChild(name);
		item.appendChild(amount);
		container.appendChild(item);
	}
}


document.getElementById('discord-Button').addEventListener('click', function() {
    const webhookUrl = 'https://discord.com/api/webhooks/1262415214771568720/_2XyX9FxqUBk9NARl9NSrX9WHPttU_pJ1qeefoQTpLLfx5wtZos4vSUrmmdh-Zjz6NSF'; // 替換為你的 Webhook URL
    const messageContent = "天氣資訊";

    const data = {
        content: messageContent
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('發送通知時出錯');
        }
        console.log('成功發送通知到 Discord Webhook!');
    })
    .catch(error => {
        console.error('發送通知時出錯:', error);
    });
});




