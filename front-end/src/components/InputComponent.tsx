import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

type Props<T extends FieldValues> = {
  label: string
  type: string
  name: Path<T>
  register: UseFormRegister<T>
  required?: boolean
}

export const InputComponent = <T extends FieldValues>(props: Props<T>) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label 
        htmlFor={props.name}
        className="font-extralight italic text-base"
      >
        {props.label}
      </label>
      <input 
        type={props.type}
        { ...props.register(props.name, {required: props.required}) }
        id={props.name}
        className="bg-transparent border rounded-lg h-8 relative px-2"
      />
    </div>
  )
}