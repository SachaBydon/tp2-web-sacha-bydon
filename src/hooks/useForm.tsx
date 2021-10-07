import { useState, useEffect } from 'react'

export default function useForm(initialValues: any, onChange?: () => void) {
  const [formValues, setFormValues] = useState(initialValues)

  function updateForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  useEffect(() => {
    if (onChange) onChange()
  }, [formValues])

  function clearForm() {
    setFormValues(initialValues)
  }

  function setValue(name: string, value: any) {
    setFormValues({ ...formValues, [name]: value })
  }

  function setValues(attributes: { key: string; value: any }[]) {
    let newValues = { ...formValues }
    for (const { key, value } of attributes) {
      newValues[key] = value
    }
    setFormValues(newValues)
  }

  return {
    formValues,
    updateForm,
    clearForm,
    setValue,
    setValues,
  }
}
