import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  typeService: string
  register: UseFormRegister<T>
  name: Path<T>
  required?: boolean
}

export const InputRadioService = <T extends FieldValues>(props: Props<T>) => {
  const id = `${props.name}-${props.typeService}`

  return (
    <div>
      <input
        type="radio"
        id={id}
        className="hidden peer"
        value={props.typeService}
        {...props.register(props.name, { required: props.required })}
      />
      <label
        htmlFor={id}
        className="bg-blue-600 w-64 h-40 flex flex-col items-center justify-around rounded-lg cursor-pointer peer-checked:ring-4 peer-checked:ring-black text-white font-bold"
      >
        <p className="text-2xl">{props.typeService}</p>
      </label>
    </div>
  )
}