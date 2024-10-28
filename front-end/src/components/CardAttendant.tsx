import { BiEdit as Edit } from "react-icons/bi";
import { FaUser as User } from "react-icons/fa";
import { TbTrashXFilled as Trash } from "react-icons/tb";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type Props = {
  id: string;
  name: string;
  cpf: string;
  role: string;
  password: string | "********";
  onDelete: (id: string) => void;
};

const url = import.meta.env.VITE_API_URL


export const CardAttendant = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: props.name,
    cpf: props.cpf,
    role: props.role,
    password: "",
  });

  const [attendantData, setAttendantData] = useState({
    name: props.name,
    cpf: props.cpf,
    role: props.role,
    password: props.password,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${url}/update-attendants/${props.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setAttendantData((prevData) => ({
        ...prevData,
        ...formData,
        password: formData.password ? "********" : prevData.password,
      }));

      console.log("Dados do atendente atualizados:", response.data);
      Swal.fire("Sucesso!", "Atendente atualizado com sucesso.", "success");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar atendente:", error);
      Swal.fire("Erro!", "Ocorreu um erro ao atualizar o atendente.", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${url}/delete-attendants/${props.id}`)

        props.onDelete(props.id)
        Swal.fire(
          'Excluído!',
          'A senha foi excluída.',
          'success'
        )

      } catch (err) {
        Swal.fire(
          'Erro!',
          'Não foi possível excluir a senha.',
          "error",
        )

        console.error(err)
      }
    }
  }
  
  return (
    <div className="flex gap-4 items-center justify-between border-2 border-slate-950 px-2 py-3 rounded-lg">
      <User size={26} />

      <div className="flex gap-7">
        <div>
          <p className="border-b-2 border-slate-950">Nome:</p>
          <p className="mt-1">{attendantData.name}</p>
        </div>

        <div>
          <p className="border-b-2 border-slate-950">CPF:</p>
          <p className="mt-1">{attendantData.cpf}</p>
        </div>

        <div>
          <p className="border-b-2 border-slate-950">Cargo:</p>
          <p className="mt-1">{attendantData.role}</p>
        </div>

        <div>
          <p className="border-b-2 border-slate-950">Senha:</p>
          <p className="mt-1 flex gap-5 items-center">
            <span>{attendantData.password}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Trash
          size={26}
          className="text-red-600 cursor-pointer"
          onClick={() => handleDelete()}
        />
        <Edit size={26} className="cursor-pointer" onClick={() => setIsModalOpen(true)} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Atualizar Atendente</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label>
                Nome:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 w-full rounded-md"
                />
              </label>
              <label>
                CPF:
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 w-full rounded-md"
                />
              </label>
              <label>
                Cargo:
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="border border-gray-400 p-2 w-full rounded-md"
                />
              </label>
              <label>
                Senha:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite uma nova senha"
                  className="border border-gray-400 p-2 w-full rounded-md"
                />
              </label>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
