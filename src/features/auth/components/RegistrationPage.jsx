// === FILE: .\src\features\auth\components\RegistrationPage.jsx ===

import { useState } from 'react';
import { styled } from 'styled-components';
import { registerUser } from '../../../services/userApi';

// Стили скопированы и адаптированы из LoginPage.jsx для консистентности
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const RegistrationContainer = styled.div`
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
  color: #9747FF;
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

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #9747FF;
    box-shadow: 0 0 0 0.2rem rgba(151, 71, 255, 0.25);
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
  margin-top: 0.5rem; /* Небольшой отступ */

  &:hover {
    background-color: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: left;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 0.875rem;
  margin-top: 1rem;
  margin-bottom: -0.5rem;
`;


export default function RegistrationPage({ onSwitchToLogin, onRegistrationSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (password.length < 6) { // Пример простой валидации
        setError('Пароль должен быть не менее 6 символов.');
        setIsSubmitting(false);
        return;
    }

    try {
      await registerUser({ name, email, password });
      setSuccess('Регистрация прошла успешно! Теперь вы можете войти.');
      // Очищаем поля после успешной регистрации
      setName('');
      setEmail('');
      setPassword('');
      if(onRegistrationSuccess) {
        setTimeout(() => { // Небольшая задержка, чтобы пользователь увидел сообщение
            onRegistrationSuccess();
        }, 2000);
      }
    } catch (err) {
      console.error('Registration Page: Registration failed', err);
      setError(err.message || 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <RegistrationContainer>
        <Title>Best in Quest</Title>
        <Subtitle>Создание профиля</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <Input
            type="email"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <Input
            type="password"
            placeholder="Пароль (минимум 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <PrimaryButton type="submit" disabled={isSubmitting || !!success}>
            {isSubmitting ? 'Регистрация...' : 'Создать профиль'}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onSwitchToLogin} disabled={isSubmitting}>
            Уже есть аккаунт? Войти
          </SecondaryButton>
        </Form>
      </RegistrationContainer>
    </PageWrapper>
  );
}