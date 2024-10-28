import { FaUsersGear } from "react-icons/fa6";
import { RiCustomerService2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const MySwal = withReactContent(Swal);

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
    <div className="px-4">
      <header className="flex flex-col items-center justify-center border-b-2 border-slate-400 py-5">
        <h1 className="font-bold text-3xl">
          Olá, <span className="capitalize">{user.name}</span>
        </h1>
        <p>admin</p>
      </header>

      <main>
        <div className="px-96 flex flex-col items-center gap-9 mt-7">
          <Link
            to="/dashboard/atendentes"
            className="w-full group flex items-center justify-center bg-green-500 text-white py-5 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <FaUsersGear size={40} className="group-hover:animate-bounce" />
              <p className="font-bold text-3xl">Atendentes</p>
            </div>
          </Link>

          <Link
            to="/dashboard/servicos"
            className="w-full group flex items-center justify-center bg-blue-500 text-white py-5 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <RiCustomerService2Fill size={40} className="group-hover:animate-bounce" />
              <p className="font-bold text-3xl">Serviços</p>
            </div>
          </Link>

          <button
            className="w-96 bg-red-500 text-white py-5 rounded-xl font-semibold text-xl"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </main>
    </div>
  );
}
