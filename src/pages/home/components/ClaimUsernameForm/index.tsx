import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormAnnotarion } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário deve estar em 3 e 12 caracteres' })
    .max(12, { message: 'O usuário deve estar em 3 e 12 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário deve conter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          crossOrigin=""
          {...register('username')}
        />
        <Button size="sm" type="submit">
          {' '}
          Reservar <ArrowRight />
        </Button>
      </Form>

      <FormAnnotarion>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado'}
        </Text>
      </FormAnnotarion>
    </>
  )
}
