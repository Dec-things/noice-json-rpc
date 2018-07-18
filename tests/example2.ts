import * as fs from 'fs'
import * as WebSocket from 'ws'
import WebSocketServer = WebSocket.Server
import * as http from 'http'
import * as rpc from '../lib/noice-json-rpc'

async function setupClient() {
    try {
        const api = new rpc.Client(new WebSocket('ws://localhost:8076'), { logConsole: true }).api()

        setInterval(async () => {
            let result = await api.Test.sum(1, 2)
            console.log('Result', result)
            let r2 = await api.Test.testBuffer(42)
            console.log('Result', r2)
        }, 1000)

    } catch (e) {
        console.error(e)
    }
}

function setupServer() {
    const wssServer = new WebSocketServer({ port: 8076 });
    const api = new rpc.Server(wssServer).api();

    const sum = async (a: number, b: number) => {
        return a + b
    }
    const testBuffer = async (a: number) => {
        return Buffer.from('hello')
    }

    api.Test.expose({ sum, testBuffer })

}

setupServer()
setupClient()