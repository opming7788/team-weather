document.querySelectorAll("path").forEach(function (path) {
    path.addEventListener("click", function (e) {
        var tagname = this.getAttribute("data-name");
        var result = place_data.find(function (city) {
            return city.tag === tagname;
        });

        document.getElementById("CurrentCity").textContent = result.place;

        // 監聽 discord-Button 的點擊事件
        document.getElementById('discord-Button').addEventListener('click', function() {
            const webhookUrl = 'https://discord.com/api/webhooks/1262415214771568720/_2XyX9FxqUBk9NARl9NSrX9WHPttU_pJ1qeefoQTpLLfx5wtZos4vSUrmmdh-Zjz6NSF'; 
            const weatherApiUrl = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-A7E5A07D-8252-4F34-8274-69CD9263DF62';

            fetch(weatherApiUrl)
            .then(response => response.json())
            .then(data => {
                const location = data.records.location.find(loc => loc.locationName === result.place);
                if (!location) {
                    throw new Error(`未找到 ${result.place} 的天氣資訊`);
                }

                const currentWeather = location.weatherElement.find(el => el.elementName === 'Wx');
                if (!currentWeather) {
                    throw new Error(`未找到 ${result.place} 的當前時間段的 Wx 元素的天氣資訊`);
                }

                const currentWeatherNow = currentWeather.time.find(timeSlot =>
                    new Date(timeSlot.startTime) <= new Date() && new Date(timeSlot.endTime) >= new Date()
                );

                const minTemp = location.weatherElement.find(el => el.elementName === 'MinT');
                const maxTemp = location.weatherElement.find(el => el.elementName === 'MaxT');
                if (!minTemp || !maxTemp) {
                    throw new Error(`未找到 ${result.place} 的當前時間段的溫度資訊`);
                }
                const currentTempNow = `${minTemp.time[0].parameter.parameterName} ~ ${maxTemp.time[0].parameter.parameterName} °C`;

                const currentPoP = location.weatherElement.find(el => el.elementName === 'PoP');
                if (!currentPoP) {
                    throw new Error(`未找到 ${result.place} 的當前時間段的降雨量資訊`);
                }
                const currentPoPNow = currentPoP.time[0].parameter.parameterName + ' %';
                
                const tomorrowMorning = currentWeather.time.find(timeSlot =>
                    (new Date(timeSlot.startTime).getDate() === new Date().getDate() && new Date(timeSlot.startTime).getHours() >= 18) ||
                    (new Date(timeSlot.startTime).getDate() === new Date().getDate() + 1 && new Date(timeSlot.startTime).getHours() < 6)
                );

                const tomorrowNight = currentWeather.time.find(timeSlot =>
                    (new Date(timeSlot.startTime).getDate() === new Date().getDate() + 1 && new Date(timeSlot.startTime).getHours() >= 6) ||
                    (new Date(timeSlot.startTime).getDate() === new Date().getDate() + 1 && new Date(timeSlot.startTime).getHours() < 18)
                );

                const tomorrowMorningTemp = `${minTemp.time[1].parameter.parameterName} ~ ${maxTemp.time[1].parameter.parameterName} °C`;
                const tomorrowMorningPoP = tomorrowMorning ? tomorrowMorning.parameter.parameterName : '-';

                const tomorrowNightTemp = `${minTemp.time[2].parameter.parameterName} ~ ${maxTemp.time[2].parameter.parameterName} °C`;
                const tomorrowNightPoP = tomorrowNight ? tomorrowNight.parameter.parameterName : '-';

                const discordEmbed = {
                    embeds: [{
                        title: `${result.place} 天氣預報`,
                        fields: [
                            { name: '當前天氣☁️', value: currentWeatherNow ? currentWeatherNow.parameter.parameterName : '-' },
                            { name: '當前溫度🌡️', value: currentTempNow },
                            { name: '當前降雨量☔', value: currentPoPNow },
                            { name: '今日晚上至明日早上的天氣預報', value: `${tomorrowMorningPoP}，溫度 ${tomorrowMorningTemp}，降雨量 ${currentPoP.time[1].parameter.parameterName} %` },
                            { name: '明日早上至晚上的天氣預報', value: `${tomorrowNightPoP}，溫度 ${tomorrowNightTemp}，降雨量 ${currentPoP.time[2].parameter.parameterName} %` },
                        ],
                        color: 0x3498db, 
                        timestamp: new Date()
                    }]
                };
                return fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(discordEmbed)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('發送通知時出錯');
                }
                // console.log('成功發送通知到 Discord Webhook!');
            })
            .catch(error => {
                console.error('發送通知時出錯:', error);
            });
        });
    });
});








