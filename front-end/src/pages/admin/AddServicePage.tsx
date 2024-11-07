import { useForm, SubmitHandler } from "react-hook-form";
import { Header } from "../../components/Header";
import { InputAdmin } from "../../components/InputAdmin";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { CardService } from "../../components/CardService";


const url = import.meta.env.VITE_API_URL
const wsUrl = import.meta.env.VITE_WS_URL


type Service = {
  id: number
  typeService: string
}


export function AddServicePage() {

  const MySwal = withReactContent(Swal)
  const wsRef = useRef<WebSocket | null>(null)
  const { register, handleSubmit } = useForm<Service>()
  const [services, setServices] = useState<Service[]>([])

  const onSubmit: SubmitHandler<Service> = async (data) => {
    try {
      const result = await axios.post(`${url}/register-service`, data)

      if (result.status === 200) {
        MySwal.fire({
          icon: 'success',
          title: 'Serviço cadastrado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${url}/get-services`)
        console.log(data)
        setServices(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    wsRef.current = new WebSocket(`${wsUrl}/ws`)

    wsRef.current.onopen = () => {
      console.log('WebSocket connected')
    }

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log(message.data)

      if (message.event === 'created-service') {
        setServices((prevServices) => [...prevServices, message.data])
      }
    }
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      wsRef.current?.close()
    }
  }, [])

  const handleDelete = async (id: number) => {
    setServices((prevServices) => prevServices.filter((service) => service.id !== id))
  }


  return (
    <div className="px-4">
      <Header title="Serviço" />

      <main className="flex justify-center gap-10 mt-10">
        <section>
          <h2 className="font-bold text-xl text-center mb-4">Lista de Serviços</h2>
          <ul className="flex flex-col gap-4">
            {
              services.map((service) => (
                <li key={service.id}>
                  <CardService
                    id={service.id}
                    type={service.typeService}
                    onDelete={() => handleDelete(service.id)}
                  />
                </li>
              ))
            }
          </ul>
        </section>
        <section
          className="border-2 w-96 px-4 py-5 rounded-2xl shadow-2xl"
        >
          <h2 className="text-center font-bold text-xl mb-3">
            Cadastro de Serviço
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputAdmin
              label="Nome do serviço"
              name="typeService"
              placeholder="Nome do serviço"
              register={register}
              required
              type="text"
            />

            <div className="text-center mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white font-medium px-8 py-2 rounded-lg hover:ring-2 hover:ring-slate-600 transition-all duration-200"
              >
                cadastrar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}