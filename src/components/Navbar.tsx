import React, { useState, useEffect } from 'react'

function Navbar() {

    const [Nifty, setNifty] = useState<any>(null)
    const [BankNifty, setBankNifty] = useState<any>(null)
    const [FinNifty, setFinNifty] = useState<any>(null)
    const Url = 'wss://functionup.fintarget.in/ws?id=fintarget-functionup'

    useEffect(() => {
        const socket = new WebSocket(Url)

        socket.onmessage = (event: MessageEvent) => {
            const meta = JSON.parse(event.data)
            setNifty(meta.Nifty)
            setBankNifty(meta.BankNifty)
            setFinNifty(meta.FinNifty)
        }

        return () => {
            socket.close();
        }
    }, []);
    return (
        <div className='Nav'>
            <ul>
                <li>Nifty <span className={Nifty >= 19400 ? `status-green` : `status-red`}>{Nifty}</span></li>
                <li>BankNifty <span className={BankNifty >= 19400 ? `status-green` : `status-red`}>{BankNifty}</span></li>
                <li>FinNifty <span className={FinNifty >= 19400 ? `status-green` : `status-red`}>{FinNifty}</span></li>
            </ul>
        </div>

    )
}

export default Navbar