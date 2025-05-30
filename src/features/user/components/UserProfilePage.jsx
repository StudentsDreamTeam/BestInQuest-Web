// === FILE: src/features/user/components/UserProfilePage.jsx ===
import { useState, useEffect } from 'react';
import { styled } from 'styled-components';
import UserHeader from './UserHeader';
import AccountSettings from './AccountSettings';
import { useUser } from '../../../contexts/UserContext';
import { updateUserProfile } from '../../../services/userApi'; // Импорт функции обновления
// Модальное окно будет управляться из AppLayout, но кнопка сохранения здесь

const PageContainer = styled.div`
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const SaveChangesButton = styled.button`
  background-color: #2ecc71; /* Зеленый для сохранения */
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 2rem;
  margin-bottom: 2rem; /* Отступ снизу */
  align-self: center; /* Центрируем кнопку, если ContentWrapper flex */

  &:hover {
    background-color: #27ae60;
  }
  &:disabled {
    background-color: #a3e9a4;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-top: 2rem;
`;

// Пропс onOpenConfirmModal будет передан из AppLayout
export default function UserProfilePage({ onOpenConfirmModal }) {
  const { user, isLoadingUser, logout, reloadUser } = useUser();

  // Локальное состояние для редактируемых полей
  const [localName, setLocalName] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localPassword, setLocalPassword] = useState(''); // Для нового пароля

  // Состояние для отслеживания режима редактирования
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setLocalName(user.name || '');
      setLocalEmail(user.email || '');
      setLocalPassword(''); // Пароль всегда пустой при начале редактирования
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const nameChanged = user.name !== localName && localName.trim() !== '';
    const emailChanged = user.email !== localEmail && localEmail.trim() !== '';
    const passwordChanged = localPassword !== '';
    setHasChanges(nameChanged || emailChanged || passwordChanged);
  }, [user, localName, localEmail, localPassword]);


  if (isLoadingUser) {
    return <PageContainer><LoadingMessage>Загрузка профиля...</LoadingMessage></PageContainer>;
  }
  if (!user) {
    return <PageContainer><LoadingMessage>Не удалось загрузить профиль.</LoadingMessage></PageContainer>;
  }

  // Обработчики для UserHeader
  const handleToggleEditName = () => {
    if (isEditingName) { // Если отменяем редактирование имени
        setLocalName(user.name);
    }
    setIsEditingName(!isEditingName);
  };
  
  const handleSaveName = () => {
    if (localName.trim() === '') {
        alert("Имя не может быть пустым.");
        setLocalName(user.name); // Возвращаем старое имя
        setIsEditingName(false);
        return;
    }
    // Имя сохраняется при общем сохранении, здесь просто выходим из режима редактирования
    setIsEditingName(false); 
  };

  const handleCancelEditName = () => {
    setLocalName(user.name);
    setIsEditingName(false);
  };


  // Обработчики для AccountSettings (Email)
  const handleToggleEditEmail = () => {
    if (isEditingEmail) {
        setLocalEmail(user.email);
    }
    setIsEditingEmail(!isEditingEmail);
  };
  const handleSaveEmail = () => {
     if (localEmail.trim() === '' || !localEmail.includes('@')) { // Простая валидация
        alert("Введите корректный email.");
        setLocalEmail(user.email);
        setIsEditingEmail(false);
        return;
    }
    setIsEditingEmail(false);
  };
  const handleCancelEditEmail = () => {
    setLocalEmail(user.email);
    setIsEditingEmail(false);
  };

  // Обработчики для AccountSettings (Password)
  const handleToggleEditPassword = () => {
    if (isEditingPassword) {
        setLocalPassword(''); // Сбрасываем поле пароля при отмене
    }
    setIsEditingPassword(!isEditingPassword);
  };
  const handleSavePassword = () => {
    if (localPassword !== '' && localPassword.length < 6) {
        alert("Пароль должен быть не менее 6 символов.");
        // Не сбрасываем поле, даем исправить
        return; 
    }
    // Пароль сохранится при общем сохранении
    setIsEditingPassword(false);
  };
   const handleCancelEditPassword = () => {
    setLocalPassword('');
    setIsEditingPassword(false);
  };


  const handleSaveChanges = () => {
    const changesToConfirm = {
      name: { old: user.name, new: localName.trim() },
      email: { old: user.email, new: localEmail.trim() },
      password: { old: '********', new: localPassword }, // old пароль не показываем
    };
    // Открываем модалку подтверждения, передавая ей изменения
    onOpenConfirmModal(changesToConfirm, async () => {
        // Эта функция будет вызвана при подтверждении в модальном окне
        const updatePayload = {};
        if (changesToConfirm.name.new !== user.name && changesToConfirm.name.new !== '') {
            updatePayload.name = changesToConfirm.name.new;
        }
        if (changesToConfirm.email.new !== user.email && changesToConfirm.email.new !== '') {
            updatePayload.email = changesToConfirm.email.new;
        }
        if (changesToConfirm.password.new !== '') { // Отправляем пароль только если он был введен
            updatePayload.password = changesToConfirm.password.new;
        }

        if (Object.keys(updatePayload).length === 0) {
            alert("Нет изменений для сохранения.");
            return;
        }

        try {
            await updateUserProfile(user.id, updatePayload);
            alert("Профиль успешно обновлен!");
            reloadUser(); // Перезагружаем данные пользователя, чтобы отобразить изменения
            setLocalPassword(''); // Сбрасываем поле пароля после успешного сохранения
            setHasChanges(false); // Сбрасываем флаг изменений
        } catch (error) {
            console.error("Ошибка обновления профиля:", error);
            alert(`Не удалось обновить профиль: ${error.message}`);
        }
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.")) {
        console.log("Инициировано удаление аккаунта пользователя:", user.id);
        // Здесь будет реальная логика удаления аккаунта
        // logout(); // После удаления обычно следует разлогинить пользователя
    }
  };


  return (
    <PageContainer>
      <ContentWrapper>
        <UserHeader
          user={user}
          isEditingName={isEditingName}
          localName={localName}
          onNameChange={(e) => setLocalName(e.target.value)}
          onToggleEditName={handleToggleEditName}
          onSaveName={handleSaveName}
          onCancelEditName={handleCancelEditName}
        />
        <AccountSettings
          user={user}
          localEmail={localEmail}
          localPassword={localPassword}
          onEmailChange={(e) => setLocalEmail(e.target.value)}
          onPasswordChange={(e) => setLocalPassword(e.target.value)}
          isEditingEmail={isEditingEmail}
          onToggleEditEmail={handleToggleEditEmail}
          onSaveEmail={handleSaveEmail}
          onCancelEditEmail={handleCancelEditEmail}
          isEditingPassword={isEditingPassword}
          onToggleEditPassword={handleToggleEditPassword}
          onSavePassword={handleSavePassword}
          onCancelEditPassword={handleCancelEditPassword}
          onLogout={logout}
          onDeleteAccount={handleDeleteAccount}
        />
        {hasChanges && (
            <SaveChangesButton onClick={handleSaveChanges}>
                Сохранить изменения
            </SaveChangesButton>
        )}
      </ContentWrapper>
    </PageContainer>
  );
}