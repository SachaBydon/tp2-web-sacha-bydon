import { useState, useEffect } from 'react'

// UseForm hook to handle form state and validation
export default function useForm(initialValues: any, onChange?: () => void) {
  // State to track form values
  const [formValues, setFormValues] = useState(initialValues)

  // update form values on change
  function updateForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  // Fire onChange callback when form values change
  useEffect(() => {
    if (onChange) onChange()
  }, [formValues])

  // clear form values
  function clearForm() {
    setFormValues(initialValues)
  }

  // Set form value from name
  function setValue(name: string, value: any) {
    setFormValues({ ...formValues, [name]: value })
  }

  // Set muiltiple form values from names
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
