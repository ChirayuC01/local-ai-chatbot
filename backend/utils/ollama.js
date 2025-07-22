const axios = require('axios');

async function generateStream(prompt, onData, onEnd, onError, abortSignal) {
    try {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:11434/api/generate',
            responseType: 'stream',
            data: {
                model: 'gemma3',
                prompt,
                stream: true,
            },
            signal: abortSignal,
        });

        response.data.on('data', chunk => {
            const lines = chunk.toString().split('\n').filter(Boolean);
            for (const line of lines) {
                try {
                    const json = JSON.parse(line);

                    if (json.done) {
                        onEnd();
                    } else if (json.response) {
                        // Use response string exactly as emitted
                        onData(json.response);
                    }
                } catch (err) {
                    console.error('Error parsing stream chunk:', err);
                }
            }
        });

        response.data.on('end', onEnd);
    } catch (error) {
        onError(error);
    }
}

module.exports = { generateStream };
