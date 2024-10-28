import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const DateHoursCurrent = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedDate = format(currentTime, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  const formattedTime = format(currentTime, 'HH:mm:ss', { locale: ptBR })

  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="text-3xl">{formattedDate}</div>
        <div className="text-7xl">{formattedTime}</div>
      </div>
    </>
  )
}