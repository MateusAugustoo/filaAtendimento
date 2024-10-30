import { DateHoursCurrent } from "../components/DateHoursCurrent";
import { useState, useEffect } from 'react';

const urlWs = import.meta.env.VITE_WS_URL

type Thistorical = {
  password: string
  guiche: number
}

export function Painel() {
  const [password, setPassword] = useState<string | null>(null)
  const [guiche, setGuiche] = useState<number | null>(null)
  const [historical, setHistorical] = useState<Thistorical[]>([])

  useEffect(() => {
    const ws = new WebSocket(`${urlWs}/ws`)

    ws.onopen = () => {
      console.log('WebSocket connected')
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { event: eventType, data } = message;
      const { password, guiche } = data || {};

      console.log(message);

      switch (eventType) {
        case 'called-password':
          setPassword(password);
          setGuiche(guiche);
          setHistorical((prevHistorical) => {
            const updatedHistorical = [...prevHistorical, { password, guiche }];
            return updatedHistorical.slice(-6).reverse();
          })
          speak(`Senha ${password} guichê 0${guiche}`);
          break;

        case 'call-again':
          setPassword(password);
          setGuiche(guiche);
          speak(`Senha ${password} guichê 0${guiche}`);
          break;

        default:
          console.warn(`Evento desconhecido: ${eventType}`);
      }
    };

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
    utterance.volume = 2

    console.log(utterance)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <main className="bg-green-600 min-h-screen font-bold text-white grid grid-cols-5">
      <div className="px-6 capitalize flex flex-col items-center col-span-4 justify-around">
        <p className="text-7xl">senha</p>
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
              historical.map((h: Thistorical, index) => (
                <li key={index} className="flex flex-col items-center gap-1">
                  <div className="text-6xl font-extrabold">{h.password}</div>
                  <div className="text-2xl">( Guichê 0{h.guiche} )</div>
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
