// === FILE: .\src\features\auth\components\LoginPage.jsx ===

import { useState } from 'react';
import { styled } from 'styled-components';
import { useUser } from '../../../contexts/UserContext';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa; /* Светлый фон для всей страницы */
`;

const LoginContainer = styled.div`
  background-color: #fff;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #9747FF; /* Фирменный фиолетовый */
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box; /* Учитываем padding и border в общей ширине */

  &:focus {
    outline: none;
    border-color: #9747FF;
    box-shadow: 0 0 0 0.2rem rgba(151, 71, 255, 0.25);
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.8rem;

  /* Замените на вашу иконку глаза, если есть */
  /* svg {
    width: 20px;
    height: 20px;
  } */
  &:hover {
    color: #333;
  }
`;


const ForgotPasswordLink = styled.a`
  font-size: 0.875rem;
  color: #6c757d;
  text-decoration: none;
  align-self: flex-start; /* Сдвигаем влево */
  margin-top: -0.5rem; /* Небольшой отступ вверх */
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const PrimaryButton = styled.button`
  background-color: #9747FF;
  color: white;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #823cdf;
  }
  &:disabled {
    background-color: #c7a5f2;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  background-color: #fff;
  color: #333;
  padding: 0.9rem 1.5rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: -0.5rem; /* Компенсировать отступ формы */
  text-align: left;
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      // Успешный вход обработается в App.jsx через UserContext
      // onLoginSuccess больше не нужен здесь, так как App.jsx слушает user из context
    } catch (err) {
      console.error('Login Page: Login failed', err);
      setError(err.message || 'Ошибка входа. Пожалуйста, проверьте данные.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProfile = () => {
    console.log('Переход на страницу создания профиля (пока не реализовано)');
    // Здесь будет логика перехода на другую страницу или модальное окно
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  return (
    <PageWrapper>
      <LoginContainer>
        <Title>Best in Quest</Title>
        <Subtitle>Вход в профиль</Subtitle>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="email"
              placeholder="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </InputGroup>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <PasswordToggle type="button" onClick={toggleShowPassword} title={showPassword ? "Скрыть пароль" : "Показать пароль"} disabled={isSubmitting}>
              {showPassword ? "Скрыть" : "Показать"}
            </PasswordToggle>
          </InputGroup>
          <ForgotPasswordLink href="#">Не помню пароль</ForgotPasswordLink>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={handleCreateProfile} disabled={isSubmitting}>
            Создать профиль
          </SecondaryButton>
        </Form>
      </LoginContainer>
    </PageWrapper>
  );
}