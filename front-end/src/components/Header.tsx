import { IoIosArrowBack as ArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string
}

export const Header = ({title}: Props) => {

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <header className="flex items-center justify-between border-b-2 border-slate-600 py-7">
      <ArrowBack size={40} onClick={handleBack} className="cursor-pointer"/>
      <h1 className="font-bold text-2xl">{title}</h1>
      <div></div>
    </header>
  )
}