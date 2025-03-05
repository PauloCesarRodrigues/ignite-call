import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'O nome deve estar em 5 e 30 caracteres' })
    .max(30, { message: 'O nome deve estar em 5 e 30 caracteres' })
    .regex(/^([a-z\\ ]+)$/i, {
      message: 'O usuário deve conter apenas letras',
    })
    .transform((name) => name.toLowerCase()),

  username: z
    .string()
    .min(3, { message: 'O usuário deve estar em 3 e 12 caracteres' })
    .max(12, { message: 'O usuário deve estar em 3 e 12 caracteres' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário deve conter apenas letras e hifens',
    })
    .transform((username) => username.toLowerCase()),
})

type RegisterFormData = z.infer<typeof RegisterFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (e) {
      if (e instanceof AxiosError && e?.response?.data?.message) {
        alert(e.response.data.message)
        return
      }

      console.error(e)
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm"> Nome de usuário</Text>
            <TextInput
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />

            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm"> Nome completo</Text>
            <TextInput
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              crossOrigin={undefined}
              placeholder="Seu nome"
              {...register('name')}
            />

            {errors.name && (
              <FormError size="sm">{errors.name.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />{' '}
          </Button>
        </Form>
      </Container>
    </>
  )
}
