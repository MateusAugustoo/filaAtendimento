import axios from "axios";
import { TbTrashXFilled as Trash } from "react-icons/tb";
import Swal from "sweetalert2";

type Props = {
  id: number
  type: string
  onDelete: (id: number) => void
}

const url = import.meta.env.VITE_API_URL


export const CardService = (props: Props) => {

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
        await axios.delete(`${url}/delete-service/${props.id}`)

        props.onDelete(props.id)
        Swal.fire(
          'Excluído!',
          'O Serviço foi excluída.',
          'success'
        )

      } catch (err) {
        Swal.fire(
          'Erro!',
          'Não foi possível excluir o serviço.',
          "error",
        )

        console.error(err)
      }
    }
  }

  return(
    <div
      className="w-56 flex items-center justify-between bg-blue-500 text-white font-bold capitalize py-3 px-4 rounded-lg"
    >
      <p>{props.type}</p>
      <Trash 
        size={20} 
        color="red"
        className="cursor-pointer"
        onClick={() => handleDelete()}
      />
    </div>
  )
}