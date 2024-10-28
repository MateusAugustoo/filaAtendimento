import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  label: string
  type: string
  name: Path<T>
  placeholder: string
  register: UseFormRegister<T>
  required?: boolean
}

export const InputAdmin = <T extends FieldValues>(props: Props<T>) => {
  return (
    <li className="flex flex-col gap-2">
      <label
        htmlFor={props.name}
        className="text-base"
      >
        {props.label}
      </label>
      <input
        id={props.name}
        type={props.type}
        placeholder={props.placeholder}
        {...props.register(props.name, { required: props.required })}
        className="w-full h-9 px-2 ring-2 ring-black rounded-lg"
      />
    </li>
  )
}