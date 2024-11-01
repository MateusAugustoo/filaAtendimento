import { FaUser } from 'react-icons/fa';
import { TPass } from '../types/TPass';
import { FiSearch as SearchIcon } from 'react-icons/fi';
import { ItemListSenha } from '../components/ItemListSenha';
import { HiMegaphone as MegaphoneIcon } from 'react-icons/hi2';
import { FaStop as StopIcon, FaLongArrowAltRight as ArrowRightIcon } from 'react-icons/fa';
import axios from 'axios';
import { addHours } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { TService } from '../types/TService';
import { HiOutlineLogout as LogoutIcon } from "react-icons/hi";

const url = import.meta.env.VITE_API_URL
const urlWs = import.meta.env.VITE_WS_URL

export function AtendentePage() {
  const MySwal = withReactContent(Swal);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [passwords, setPasswords] = useState<TPass[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('NA');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<TPass | null>(null);
  const [guicheNumber, setGuicheNumber] = useState<number | null>(null);
  const [services, setServices] = useState<TService[] | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await axios.get(`${url}/get-services`)
      setServices(data)

      if (data.length > 0) {
        setSelectedService(data[0].name)
      }
    }

    fetchServices()
  }, [])

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const { data } = await axios.get(`${url}/get-passwords`);
        const today = addHours(new Date(), -3).toISOString().split('T')[0];
        setPasswords(
          Array.isArray(data)
            ? data.filter((password: TPass) => {
              const passwordDate = new Date(password.day).toISOString().split('T')[0];
              return passwordDate === today && password.status;
            })
            : []
        );
      } catch (error) {
        console.error('Error fetching passwords:', error);
      }
    };

    fetchPasswords();
  }, []);

  const connectWebSocket = () => {
    websocketRef.current = new WebSocket(`${urlWs}/ws`);

    websocketRef.current.onopen = () => {
      console.log('WebSocket connected');
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
        reconnectIntervalRef.current = null;
      }
    };

    websocketRef.current.onmessage = (message) => {
      const { event, data } = JSON.parse(message.data);
      switch (event) {
        case 'new-password':
          setPasswords((prevPasswords) => [...prevPasswords, data]);
          break;
        case 'sinc-queue': {
          const updatedPassword = data;
          setPasswords((prevPasswords) =>
            prevPasswords.map((p) =>
              p.id === updatedPassword.id ? updatedPassword : p
            )
          );
          break;
        }
        case 'delete-password':
          setPasswords((prevPasswords) =>
            prevPasswords.filter((password) => password.id !== data.id)
          );
          break;
        default:
          break;
      }
    };

    websocketRef.current.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      attemptReconnection();
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      websocketRef.current?.close();
    };
  };

  const attemptReconnection = () => {
    if (!reconnectIntervalRef.current) {
      reconnectIntervalRef.current = setInterval(() => {
        console.log('Attempting WebSocket reconnection...');
        connectWebSocket();
      }, 5000);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      websocketRef.current?.close();
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPasswords = passwords.filter((password) => {
    const matchesStatus = filterStatus && password.status ? password.status === filterStatus : true;
    const matchesSearch = password.password ? password.password.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesService = selectedService && password.typeService ? password.typeService === selectedService : true;
    return matchesStatus && matchesSearch && matchesService;
  });

  const handleDeletePassword = async (passwordId: number) => {
    const result = await MySwal.fire({
      title: 'Deseja excluir essa senha?',
      text: 'Essa ação é irreversível!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${url}/delete-password/${passwordId}`);

        const updatedPasswords = passwords.filter((password: TPass) => Number(password.id) !== passwordId);
        setPasswords(updatedPasswords);

        // Envia um evento de exclusão pelo WebSocket
        if (websocketRef.current && websocketRef.current.readyState === websocketRef.current.OPEN) {
          const payload = {
            event: 'delete-password',
            data: { id: passwordId },
          };

          websocketRef.current.send(JSON.stringify(payload));
        }

        MySwal.fire({
          title: 'Senha excluída!',
          text: 'A senha foi excluída com sucesso.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        MySwal.fire({
          title: 'Erro!',
          text: 'Não foi possível excluir a senha. Tente novamente.',
          icon: 'error',
        });
      }
    }
  };

  const handleNextPassword = async () => {
    const result = await MySwal.fire({
      title: 'Deseja iniciar o atendimento?',
      text: 'Você está prestes a iniciar o atendimento.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, iniciar!',
      cancelButtonText: 'Cancelar',
    });

    if (guicheNumber === null) {
      MySwal.fire({
        title: 'Erro!',
        text: 'Digite um número de guichê!',
        icon: 'error',
      })
    } else if (result.isConfirmed) {
      try {
        const nextPassword = passwords.find((password: TPass) => password.status === 'NA');
        if (nextPassword) {
          try {
            await axios.put(`${url}/update-status/${nextPassword.id}`, {
              status: 'C',
              guiche: guicheNumber,
            });

            const updatedPasswords = passwords.map((password: TPass) => {
              if (password.id === nextPassword.id) {
                return { ...password, status: 'C' };
              }
              return password;
            });

            setPasswords(updatedPasswords);
            setCurrentPassword(nextPassword);

            MySwal.fire({
              title: 'Atendimento iniciado!',
              text: `Senha ${nextPassword.password} foi chamada.`,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false,
            });
          } catch (error) {
            console.error(error);
          }
        } else {
          setCurrentPassword(null)
        }
      } catch (error) {
        console.error(error)
      }
    }
  };

  const hanleAnswerAgainPassword = async (password: TPass) => {
    if (password.status === 'C') {
      const result = await MySwal.fire({
        title: 'Deseja reabrir o atendimento?',
        text: 'Você está prestes a reabrir o atendimento!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, reabrir!',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          setCurrentPassword(password)
          const updatedPasswords = passwords.map((p: TPass) => {
            if (p.id === password.id) {
              return { ...p, status: 'A' }
            }
            return p
          })

          setPasswords(updatedPasswords)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }


  const handleCloseService = async () => {
    const result = await MySwal.fire({
      title: 'Deseja encerrar o atendimento?',
      text: 'Você está prestes a encerrar o atendimento!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, encerrar!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed && currentPassword) {
      try {
        await axios.put(`${url}/update-status/${currentPassword.id}`, {
          status: 'A',
        });

        const updatedPasswords = passwords.map((password: TPass) => {
          if (password.id === currentPassword.id) {
            return { ...password, status: 'A' };
          }
          return password;
        });

        setPasswords(updatedPasswords);
        setCurrentPassword(null);

        MySwal.fire({
          title: 'Atendimento encerrado!',
          text: 'Atendimento encerrado com sucesso.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        MySwal.fire({
          title: 'Erro!',
          text: 'Não foi possível encerrar o atendimento. Tente novamente.',
          icon: 'error',
        });
      }
    }
  };

  const handleChangeGuiche = async () => {
    const { value: newGuicheNumber } = await MySwal.fire({
      title: 'Alterar Guichê',
      input: 'number',
      inputLabel: 'Digite o novo número de guichê',
      inputValue: guicheNumber,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Você deve inserir um número!';
        }
      },
    });

    if (newGuicheNumber) {
      setGuicheNumber(newGuicheNumber);
      MySwal.fire({
        title: 'Guichê alterado!',
        text: `O novo guichê é: ${newGuicheNumber}`,
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  }

  const handleCallAgainPassword = async () => {
    if (currentPassword === null) {
      MySwal.fire({
        title: 'Erro!',
        text: 'Nenhuma senha foi chamada!',
        icon: 'error',
      })
    }

    if (currentPassword) {
      const result = await MySwal.fire({
        title: 'Deseja rechamar a senha?',
        text: 'Ira rechamar a senha!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, rechamar!',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${url}/call-again`, {
            password: currentPassword?.password,
            guiche: guicheNumber,
          })
          console.log(response)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  const logout = () => {
    MySwal.fire({
      title: 'Deseja sair?',
      text: 'Tem certeza que deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: 'Saindo...',
          timer: 1000,
          didOpen: () => {
            MySwal.showLoading();
          },
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        setTimeout(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.reload();
        }, 1000);
      }
    });
  }

  return (
    <div className="px-6 py-9">
      <header className="flex justify-between items-center gap-4 px-6 py-4 border-b border-neutral-300 mb-8">
        <div className='flex gap-5'>
          <div className='flex gap-4 items-center'>
            <FaUser size={36} />
            <h1 className="font-bold text-3xl">{user.name}</h1>
          </div>

          {
            services && services.length > 0 &&
            <select
              name="service"
              id="service"
              className="border border-black rounded-lg px-2 py-1 font-semibold bg-transparent"
              onChange={handleServiceChange}
            >
              {
                services.map((service) => (
                  <option
                    key={service.id}
                    value={service.typeService}
                    className="font-semibold">
                    {service.typeService}
                  </option>
                ))
              }
            </select>
          }
        </div>

        <button
          className='flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-2 rounded-lg'
          onClick={logout}
        >
          <span>Sair</span>
          <LogoutIcon size={26} />
        </button>
      </header>

      <main className="flex gap-6">
        <section className="flex flex-col items-center gap-5">
          <div className="w-[20.938rem] h-[22rem] border border-black rounded-lg">
            <header className="px-5 py-3 flex justify-between bg-slate-300 rounded-t-lg">
              <h2 className="font-semibold text-base">Minha fila</h2>
              <select
                name="filter_status"
                id="filter_status"
                className="border border-black rounded-lg px-2 py-1 font-semibold bg-transparent"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="NA" className="font-semibold">
                  Não atendidos
                </option>
                <option value="A" className="font-semibold">
                  Atendidos
                </option>
                <option value="C" className="font-semibold">
                  Chamados
                </option>
              </select>
            </header>

            <ul className="overflow-y-scroll h-[18rem]">
              {filteredPasswords.map((password: TPass) => (
                <li key={password.id}>
                  <ItemListSenha
                    id={password.id}
                    senha={password.password}
                    status={password.status}
                    onDelete={() => handleDeletePassword(password.id)}
                    onAnswerAgain={() => hanleAnswerAgainPassword(password)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="relative w-60">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Consulta senha"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block border border-black rounded-lg py-2 px-3"
            />
            <SearchIcon
              size={30}
              className="absolute end-3 top-2 text-black/10"
            />
          </div>
        </section>

        <section className="w-full flex flex-col gap-8">
          <div className="border border-slate-300 rounded-lg">
            <div className="flex justify-between pr-6 pl-3 py-5">
              <div className="flex gap-7">
                <span className="font-semibold text-2xl">Guichê:</span>
                <p className="font-bold text-2xl">{guicheNumber}</p>
              </div>
              <button
                className="font-semibold text-xl"
                onClick={handleChangeGuiche}
              >
                Alterar
              </button>
            </div>
            <hr />
            <div className="pl-3 py-5 flex gap-10 items-center">
              <span className="font-bold text-2xl capitalize">Senha:</span>
              <span className="font-bold text-3xl uppercase">
                {currentPassword ? currentPassword.password : '------'}
              </span>
            </div>
          </div>

          <hr className="border-slate-400" />

          <div className="flex gap-4">
            <button
              className="bg-slate-900 w-full py-3 text-white text-base font-semibold flex flex-col items-center rounded-lg"
              onClick={handleCallAgainPassword}
            >
              <MegaphoneIcon size={40} />
              <span>Chamar novamente</span>
            </button>
            <button
              className="bg-blue-500 w-full py-3 text-white text-base font-semibold flex flex-col items-center rounded-lg"
              onClick={handleCloseService}
            >
              <StopIcon size={40} />
              <span>Encerrar atendimento</span>
            </button>
            <button
              className="bg-green-500 w-full py-3 text-white text-base font-semibold flex flex-col items-center rounded-lg"
              onClick={handleNextPassword}
            >
              <ArrowRightIcon size={40} />
              <span>Próxima senha</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
