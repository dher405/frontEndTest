// src/Diagnostics.js
import React, { useState, useEffect } from 'react';

function Diagnostics() {
    const [browserInfo, setBrowserInfo] = useState('');
    const [stunIceOutput, setStunIceOutput] = useState('');
    const [websocketOutput, setWebsocketOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const runTests = async () => {
        setLoading(true);
        setBrowserInfo('Gathering Browser and OS information...');
        setStunIceOutput('Testing STUN/ICE...');
        setWebsocketOutput('Testing WebSocket...');

        gatherBrowserInfo();
        await testSTUNICE();
        testWebSocket();
        setLoading(false);
    };

    const gatherBrowserInfo = () => {
        setBrowserInfo(`
            <p><strong>Browser:</strong> ${navigator.userAgent}</p>
            <p><strong>Platform:</strong> ${navigator.platform}</p>
            <p><strong>Online:</strong> ${navigator.onLine ? 'Yes' : 'No'}</p>
        `);
    };

    const testSTUNICE = async () => {
        try {
            const configuration = {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Replace with your STUN server.
            };
            const pc = new RTCPeerConnection(configuration);

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    setStunIceOutput((prev) => prev + `<br>ICE Candidate: ${JSON.stringify(event.candidate)}`);
                } else {
                    setStunIceOutput((prev) => prev + '<br>ICE gathering complete.');
                    pc.close();
                }
            };

            pc.oniceconnectionstatechange = () => {
                setStunIceOutput((prev) => prev + `<br>ICE Connection State: ${pc.iceConnectionState}`);
            };

            pc.createDataChannel('test');
            await pc
                .createOffer()
                .then((offer) => pc.setLocalDescription(offer))
                .catch((error) => {
                    setStunIceOutput((prev) => prev + `<br>Error creating offer: ${error}`);
                });
        } catch (error) {
            setStunIceOutput((prev) => prev + `<br>STUN/ICE test failed: ${error}`);
        }
    };

    const testWebSocket = () => {
    setWebsocketOutput('Testing WebSocket...');
    const ws = new WebSocket('wss://echo.websocket.events');

    ws.onopen = () => {
        setWebsocketOutput((prev) => prev + '<br>WebSocket connection opened.');
        ws.close();
    };

    ws.onerror = (error) => {
        setWebsocketOutput((prev) => prev + `<br>WebSocket error: ${error.message}`);
    };
};

    return (
        <div>
            <h1>Network Diagnostics</h1>
            <button onClick={runTests} disabled={loading}>
                {loading ? 'Running Tests...' : 'Run Tests'}
            </button>
            <div id="results">
                <div className="test-section" dangerouslySetInnerHTML={{ __html: browserInfo }}></div>
                <div className="test-section" dangerouslySetInnerHTML={{ __html: stunIceOutput }}></div>
                <div className="test-section" dangerouslySetInnerHTML={{ __html: websocketOutput }}></div>
            </div>
            <style>
                .test-section {
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin-bottom: 15px;
                }
            </style>
        </div>
    );
}

export default Diagnostics;
