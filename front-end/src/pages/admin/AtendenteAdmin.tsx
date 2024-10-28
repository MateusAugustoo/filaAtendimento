import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../components/Header";
import { InputAdmin } from "../../components/InputAdmin";

import { CardAttendant } from "../../components/CardAttendant";
import { TAttendant } from "../../types/TAttendant";

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";

type Props = {
  id: number;
  name: string;
  cpf: string;
  role: string;
}

const url = import.meta.env.VITE_API_URL
const urlWs = import.meta.env.VITE_WS_URL


export function AtendenteAdmin() {

  const { register, handleSubmit } = useForm<TAttendant>();
  const [attendants, setAttendants] = useState<Props[]>([])
  const wsRef = useRef<WebSocket | null>(null);

  const onSubmit: SubmitHandler<TAttendant> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        return
      }

      const result = await axios.post(`${url}/register`, data);

      if (result.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Atendente registrado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchAttendants = async () => {
      try {
        const { data } = await axios.get(`${url}/get-attendants`);

        setAttendants(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAttendants()
  }, [])

  useEffect(() => {
    wsRef.current = new WebSocket(`${urlWs}/ws`);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'created-attendant') {
        setAttendants((prevAttendants) => [...prevAttendants, message.data]);
      }
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      wsRef.current?.close();
    }
  }, [])

  const handleDelete = async (id: number) => {
    setAttendants((prevAttendants) => prevAttendants.filter((attendant) => attendant.id !== id));
  }

  return (
    <div className="px-4">
      <Header
        title="Atendentes"
      />

      <main className="flex justify-center gap-10 mt-10">
        <section>
          <h2 className="text-2xl font-bold text-center mb-4">
            Lista de atendentes
          </h2>

          <div>
            <ul className="flex flex-col gap-4">
              {
                attendants.map((attendant: Props) => (
                  <li key={attendant.id}>
                    <CardAttendant
                      id={String(attendant.id)}
                      name={attendant.name}
                      cpf={attendant.cpf}
                      password="********"
                      role={attendant.role}
                      onDelete={() => handleDelete(attendant.id)}
                    />
                  </li>
                ))
              }
            </ul>
          </div>
        </section>
        <section
          className="border-2 w-96 px-4 py-9 rounded-2xl shadow-2xl"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset>
              <legend
                className="text-center font-bold text-2xl"
              >
                Cadastro de atendente
              </legend>

              <ul>
                <InputAdmin
                  label="Nome do atendente"
                  name="name"
                  placeholder="Nome do atendente"
                  type="text"
                  required
                  register={register}
                />
                <InputAdmin
                  label="CPF:"
                  name="cpf"
                  placeholder="000.000.000-00"
                  type="text"
                  required
                  register={register}
                />
                <InputAdmin
                  label="Senha:"
                  name="password"
                  placeholder="Digite sua senha"
                  type="password"
                  required
                  register={register}
                />
                <InputAdmin
                  label="Confirmar senha:"
                  name="confirmPassword"
                  placeholder="Confirme sua senha"
                  type="password"
                  required
                  register={register}
                />
                <li className="flex flex-col gap-2">
                  <label htmlFor="role">Cargo:</label>
                  <select
                    id="role"
                    {...register('role')}
                    className="w-full h-9 px-2 ring-2 ring-black rounded-lg"
                  >
                    <option value="attendant">Atendente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </li>
              </ul>

              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white font-medium px-8 py-2 rounded-lg hover:ring-2 hover:ring-slate-600 transition-all duration-200"
                >
                  Cadastrar
                </button>
              </div>
            </fieldset>
          </form>
        </section>
      </main>
    </div>
  )
}