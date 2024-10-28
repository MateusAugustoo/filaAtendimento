import { TbTrashXFilled as Trash } from 'react-icons/tb'
import { HiTicket as Ticket } from "react-icons/hi2";

import Swal from 'sweetalert2';
import axios from 'axios';

type Props = {
  senha: string
  status: string,
  id: string,
  onDelete: (id: string) => void
}


const url = import.meta.env.VITE_API_URL

export const ItemListSenha = (props: Props) => {

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

    if(result.isConfirmed){
      try {
        await axios.delete(`${url}/delete-password/${props.id}`)

        props.onDelete(props.id)
        Swal.fire(
          'Excluído!',
          'A senha foi excluída.',
          'success'
        )

      } catch(err){
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
    <div
      className="px-4 py-1 flex justify-between border-b border-neutral-300"
    >
      <div className="flex items-center gap-2">
        <Ticket size={20}/>
        <p className="uppercase font-semibold">{ props.senha }</p>
      </div>
      <div className="flex gap-2">
        <span className="capitalize font-semibold">status:</span>
        <span className="italic font-extralight">{ props.status }</span>
        <button onClick={handleDelete}>
          <Trash size={20} color='red'/>
        </button>
      </div>
    </div>
  )
}