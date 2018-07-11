import * as fs from 'fs'
import * as WebSocket from 'ws'
import WebSocketServer = WebSocket.Server
import * as rpc from '../lib/noice-json-rpc'

class Test {
    constructor(public arg?: number) {
    }
    add(a: number, b: number): number {
        return a + b
    }
    Foo(): new () => {} {
        return Test
    }
    on(kind: string, handler: () => any) {
    }
}

class Server {
    proxy: any
    server: rpc.Server
    constructor() {
        const wssServer = new WebSocketServer({port: 8080});
        this.server = new rpc.Server(wssServer)
        this.proxy = this.server.api('Test.');

        const enable = () => Promise.resolve()

        const test = new Test()

        this.api().expose({add: test.add.bind(test)})

        setInterval(() => {
            this.api().emitTesting('hello', 'hejsan')
        }, 5000)
    }
    api(): any {
        return this.proxy
    }
}

class Client {
    test: Test
    client: rpc.Client
    constructor() {
        this.setupClient()
    }
    async setupClient() {
        try {
            this.client = new rpc.Client(new WebSocket('ws://localhost:8080'), {logConsole: true})
            this.test = this.client.api('Test.') as Test

            let sum = await this.test.add(1, 2)

            this.client.on('Test.testing', (a: string, b: string) => {
                console.log('something happened: ' + a + ' ' + b)
            })

            //let obj = new (this.test)

            let x = 99

        } catch (e) {
            console.error(e)
        }
    }
}

new Server()
new Client()