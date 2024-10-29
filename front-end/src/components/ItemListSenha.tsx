import { TbTrashXFilled as Trash } from 'react-icons/tb'
import { HiTicket as Ticket } from "react-icons/hi2";


type Props = {
  senha: string
  status: string,
  id: number,
  onDelete: (id: number) => void
}


export const ItemListSenha = (props: Props) => {
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
        <button onClick={() => props.onDelete(props.id)}>
          <Trash size={20} color='red'/>
        </button>
      </div>
    </div>
  )
}
