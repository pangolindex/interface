import React from "react"
import {useContext, useEffect} from "react"
import {MouseoverTooltip} from "../Tooltip";
import styled from 'styled-components'
import {Validator, FormContext} from './'

export const StyledInput = styled.input<{ error?: boolean }>`
  color: ${({error, theme}) => (error ? theme.red1 : theme.text1)};
  position: relative;
  display: flex;
  padding: 16px;
  margin-bottom: 8px;
  align-items: center;
  width: 100%;
  autocomplete: off;
  flex: 0 0 100%;
  white-space: nowrap;
  background: transparent;
  border-radius: 8px;
  color: ${({theme}) => theme.text1};
  border-style: solid;
  border: 1px solid ${({error, theme}) => (error ? theme.red1 : theme.bg2)};
  background: ${({theme}) => theme.bg1};
  -webkit-appearance: none;
  font-size: 24px;

  ::placeholder {
    color: ${({theme}) => theme.text4};
  }

  transition: border 100ms;

  :focus {
    border: 1px solid ${({theme}) => theme.bg3} !important;
    outline: none;
  }

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

interface InputProps {
  name: string,
  type: string,
  validators?: Validator[],
  onChange?: (val: string) => void,
  onError?: (hasError: boolean) => void,
  value?: string,
  label?: string,
  placeholder?: string,
}

export default function TextInput({
                                    name,
                                    type,
                                    validators,
                                    onChange,
                                    onError,
                                    value,
                                    label,
                                    placeholder
                                  }: InputProps) {

  const hasError = (errors: string[]): boolean => (errors && (errors).length !== 0)
  const {registerInput} = useContext(FormContext)

  useEffect(
    () => {
      registerInput({
        name: name,
        validators: validators
        // eslint-disable-next-line
      })}, []
  );

  return (
    <FormContext.Consumer>
      {(context) =>
        <MouseoverTooltip text={hasError(context.errors[name]) ? context.errors[name].join('\n') : ""}>
          <label>{label}</label>
          <StyledInput
            name={name}
            type={type}
            error={hasError(context.errors[name])}
            className="form-control"
            placeholder={placeholder}
            onBlur={() => {
              context.validateField(name)
              if (onError) {
                onError(hasError(context.errors[name]))
              }
            }}
            onChange={event => {
              const val = event.target.value;
              context.setFieldValue(name, val)
              if (onChange) {
                onChange(val)
              }
            }}
            value={value}
          />
        </MouseoverTooltip>}
    </FormContext.Consumer>)


}