import { SubmitHandler, useForm } from "react-hook-form";
import { InputComponent } from "../components/InputComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import imgPrefeituraAngical from '../img/img_pref_angical.png';
import imgSecSaudeAngical from '../img/sec_saude_img.png'

type Props = {
  property: string;
  password: string;
}

const url = import.meta.env.VITE_API_URL

export function LoginPage() {

  const [isError, setIsError] = useState<string>('');
  const { register, handleSubmit } = useForm<Props>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Props> = async (data) => {
    try {
      const result = await axios.post(`${url}/login`, data);

      if (result.status === 200 && result.data.user.token) {
        localStorage.setItem('authToken', result.data.user.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));

        const user = result.data.user;
        if (user.role === "admin") {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setIsError('Credenciais inválidas');
        }

      }

    }
  }

  return (
    <>
      <main className="text-white flex flex-col gap-4 justify-center items-center h-screen">
        <img 
          src={imgPrefeituraAngical} 
          alt="Logo da Prefeitura de Angical - PI" 
          className=""
        />
        <div className="p-9 bg-slate-900 w-[600px] flex flex-col gap-9 items-center rounded-2xl shadow-2xl">
          <h1 className="font-bold text-6xl">Login</h1>
          <div className="border-b-2 border-slate-400 w-full"></div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-96 flex flex-col gap-9 items-center">
            <InputComponent
              label="Usuário:"
              name="property"
              type="text"
              required
              register={register}
            />

            <InputComponent
              label="Senha:"
              name="password"
              type="password"
              required
              register={register}
            />

            <p className="text-red-500">{isError}</p>
            <button
              type="submit"
              className="bg-gray-50 text-slate-900 font-bold text-sm px-14 py-2 rounded-lg"
            >
              Entrar
            </button>
          </form>
        </div>
        <img 
          src={imgSecSaudeAngical} 
          alt="Logo da secretaria municipal de saúde de Angical - PI" 
          className=""
        />
      </main>
    </>
  );
}