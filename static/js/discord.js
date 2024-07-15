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