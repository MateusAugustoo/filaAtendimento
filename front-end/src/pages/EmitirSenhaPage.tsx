import { useEffect, useState } from "react";
import { HiTicket as Ticket } from "react-icons/hi2";
import { InputRadioService } from "../components/InputRadioService";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";


const url = import.meta.env.VITE_API_URL

type TService = {
  id: number,
  typeService: string
}

type Pass = {
  password: string,
  status: string,
  typeService?: string,
}

export function EmitirSenhaPage() {

  const [services, setServices] = useState<TService[]>([]);
  
  useEffect(() => {
    const getGuiches = async () => {
      const { data } = await axios.get(`${url}/get-services`);
      setServices(data)
    }

    getGuiches()
  }, []);
  

  const { register, handleSubmit, formState: { errors } } = useForm<Pass>()

  const generatePassword = () => {
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                    String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const numbers = Math.floor(100 + Math.random() * 900); // Gera um número entre 100 e 999
    return `${letters}${numbers}`;
  }

  const onSubmit: SubmitHandler<Pass> = async (data) => {
    const randomPassword = generatePassword();

    const result = await axios.post(`${url}/create-password`, {
      password: randomPassword,
      status: 'NA',
      typeService: data.typeService || null
    })
    
    if(result.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Senha emitida com sucesso',
        text: `Senha: ${randomPassword}`,
        timerProgressBar: true,
        timer: 1500
      })
    }
  }

  return (
    <div className="px-6 py-9">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-neutral-300 mb-8">
        <Ticket size={36} />
        <h1 className="font-bold text-3xl">Emitir senha</h1>
      </header>

      <div className="flex flex-col gap-7 justify-center items-center">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center"
        >
          {services &&
            <ul className="flex gap-2">
              {
                services.map((service) => (
                  <li key={service.id}>
                    <InputRadioService 
                      typeService={service.typeService}
                      name="typeService"
                      register={register}
                      required
                    />
                  </li>
                ))
              }
            </ul>
          }
          {errors.typeService && <p className="text-red-500 font-extrabold text-xl mt-2">Por favor, selecione uma opção de serviço.</p>}
          <button
            className="flex justify-center gap-9 rounded-lg bg-green-500 w-[432px] py-4 text-white font-bold text-4xl"
          >
            <Ticket size={36} />
            <p>Emitir Senha</p>
          </button>
        </form>
      </div>
    </div>
  )
}