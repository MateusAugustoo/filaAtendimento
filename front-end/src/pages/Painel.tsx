import { DateHoursCurrent } from "../components/DateHoursCurrent";
import { useState, useEffect } from 'react';

const urlWs = import.meta.env.VITE_WS_URL

export function Painel() {
  const [password, setPassword] = useState<string | null>(null)
  const [guiche, setGuiche] = useState<number | null>(null)
  const [historical, setHistorical] = useState<string[]>([])

  useEffect(() => {
    const ws = new WebSocket(`${urlWs}/ws`)

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      console.log(message)
      if (message.event === 'called-password') {
        const { password, guiche } = message.data

        setPassword(password)
        setGuiche(guiche)
        
        setHistorical((prevHistorical) => {
          const updatedHistorical = [message.data.password, ...prevHistorical]
          return updatedHistorical.slice(0, 11)
        })

        speak(`Senha ${password} guichê 0${guiche}`)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      ws.close()
    }
  }, [])

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'

    console.log(utterance)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="bg-green-600 min-h-screen font-bold text-white grid grid-cols-5">
      <div className="px-6 capitalize flex flex-col items-center col-span-4 justify-around">
        <p className="text-6xl">senha</p>
        <hr className="border-2 rounded-full w-full" />
        <p className="uppercase text-[12.25rem]">{password}</p>
        <hr className="border-2 rounded-full w-full" />
        <p className="text-8xl">guichê <span>0{guiche}</span></p>
      </div>

      <div className="border-l-2 border-white px-6 pt-4 pb-8 flex flex-col justify-between">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-3xl">Histórico:</h3>
          <ul className="flex flex-col items-center justify-center gap-3">
            {historical.length === 0 ? (
              <li className="text-xl font-extralight italic">Vazio</li>
            ) : (
              historical.map((password, index) => (
                <li 
                  key={index} 
                  className="text-5xl"
                >
                  {password}
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="border-t-2 border-white flex flex-col items-center">
          <DateHoursCurrent />
        </div>
      </div>
    </main>
  )
}
