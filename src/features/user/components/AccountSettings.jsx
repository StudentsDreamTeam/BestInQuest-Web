import { styled } from 'styled-components';
import { useUser } from '../../../contexts/UserContext';

const SettingsContainer = styled.div`
  padding-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-size: 1rem;
  color: #555;
`;

const SettingValue = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const ActionLink = styled.button`
  font-size: 0.9rem;
  color: #9747FF;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
    color: #7a3bb8;
  }
`;

const DestructiveActionLink = styled(ActionLink)`
  color: #dc3545;
  &:hover {
    color: #c82333;
  }
`;


export default function AccountSettings() {
  const { user } = useUser();

  if (!user) return null;

  const handleEditEmail = () => {
    console.log("Инициировано изменение email. Текущий email:", user.email);
    // Логика изменения email (появится позже)
  };

  const handleEditPassword = () => {
    console.log("Инициировано изменение пароля.");
    // Логика изменения пароля (появится позже)
  };

  const handleDeleteAccount = () => {
    console.log("Инициировано удаление аккаунта пользователя:", user.id);
    // Логика удаления (появится позже, вероятно, с модальным окном подтверждения)
  };

  const handleLogout = () => {
    console.log("Инициирован выход из аккаунта пользователя:", user.id);
    // Логика выхода (появится позже)
  };

  return (
    <SettingsContainer>
      <SectionTitle>Аккаунт</SectionTitle>
      <SettingItem>
        <div>
          <SettingLabel>Email</SettingLabel>
          <SettingValue style={{display: 'block', marginTop: '0.25rem'}}>{user.email}</SettingValue>
        </div>
        <ActionLink onClick={handleEditEmail}>изменить</ActionLink>
      </SettingItem>
      <SettingItem>
        <SettingLabel>Пароль</SettingLabel>
        <ActionLink onClick={handleEditPassword}>изменить</ActionLink>
      </SettingItem>
      <SettingItem>
        <DestructiveActionLink onClick={handleDeleteAccount}>Удалить аккаунт</DestructiveActionLink>
      </SettingItem>
      <SettingItem>
        <ActionLink onClick={handleLogout}>Выйти</ActionLink>
      </SettingItem>
    </SettingsContainer>
  );
}