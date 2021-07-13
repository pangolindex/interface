import React, {useState} from "react"

export const FormContext = React.createContext<any | undefined>(undefined)

export interface Data {
  [key: string]: any
}

export type Validator = (val: string) => string[]


export interface Validators {
  [key: string]: Validator[]
}

export interface Errors {
  [key: string]: string[]
}

export interface FormState {
  data: Data
  validators: Validators
  errors: Errors
}

interface FormProps {
  initialValues?: Data,
  onSubmit: (data: Data) => void,
  onReset?: () => void,
  children?: React.ReactNode,
  id?: string,
  className?: string
}

export function isEmpty(input: Validators | Errors): boolean {
  return (Object.keys(input).length === 0)
}

export default function PurchaseForm({
                               initialValues,
                               onSubmit,
                               onReset,
                               children,
                               id,
                               className
                             }: FormProps) {

  function initState(): FormState {
    return {
      data: {
        ...initialValues
      },
      validators: {},
      errors: {}
    }
  }

  const [formState, setFormState] = useState<FormState>(initState())
  const validate = () => {
    const {validators} = formState

    setFormState(state => ({
      ...state,
      errors: {}
    }))

    if (isEmpty(validators)) {
      return true
    }

    const formErrors = Object.entries(validators).reduce<Errors>(
      (errors, [name, validators]) => {
        const {data} = formState
        const messages = validators.reduce<string[]>((result, validator) => {
          const value = data[name]
          const err = validator(value)
          return [...result, ...err]
        }, [])

        if (messages.length > 0) {
          errors[name] = messages
        }

        return errors
      },
      {}
    )

    if (isEmpty(formErrors)) {
      return true
    }

    setFormState(state => ({
      ...state,
      errors: formErrors
    }))

    return false
  }

  const validateField = (name: string) => {
    let formErrors = formState.errors
    let validators = formState.validators[name]
    const messages = validators.reduce<string[]>((result, validator) => {
      const value = formState.data[name]
      const err = validator(value)
      return [...result, ...err]
    }, [])
    if (messages.length > 0) {
      formErrors[name] = messages
    }
    setFormState(state => ({
      ...state,
      errors: formErrors
    }))
  }

  const setFieldValue = (name: string, value: any) => {
    setFormState(state => {
      return {
        ...state,
        data: {
          ...state.data,
          [name]: value
        },
        errors: {
          ...state.errors,
          [name]: []
        }
      }
    })
  }

  const registerInput = ({ name, validators } : {name: string, validators: Validator[]}) => {

    setFormState((state:FormState):FormState => {
      return {
        ...state,
        validators: {
          ...state.validators,
          [name]: validators || []
        },
        errors: {
          ...state.errors,
          [name]: []
        }
      }
    })
    
    return () => {
      setFormState(state => {
        const { data, errors, validators: currentValidators } = { ...state }
        delete data[name]
        delete errors[name]
        delete currentValidators[name]

        return {
          data,
          errors,
          validators: currentValidators
        }
      })
    }
  }

  const providerValue = {
    errors: formState.errors,
    data: formState.data,
    setFieldValue,
    validateField,
    registerInput
  }

  return (
    <FormContext.Provider value={providerValue}>
      <form
        onSubmit={event => {
          event.preventDefault()
          if (validate()) {
            onSubmit(formState.data)
          }
        }}
        onReset={event => {
          event.preventDefault()
          setFormState(initState())
          if (onReset) {
            onReset()
          }
        }}
        className={className}
        id={id}
      >
        {children}
      </form>
    </FormContext.Provider>
  )

}
