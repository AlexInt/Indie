import {serve} from 'deps.ts'

await serve(() => new Response("hello test"), {port: 30303})