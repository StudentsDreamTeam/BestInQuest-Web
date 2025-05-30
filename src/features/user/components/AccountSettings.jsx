// === FILE: .\src\features\user\components\AccountSettings.jsx ===

import { styled } from 'styled-components';
import { ReactComponent as EditIcon } from '../../../assets/icons/EditIcon.svg';
import { ReactComponent as SaveIcon } from '../../../assets/icons/SaveIcon.svg';
import { ReactComponent as CancelIcon } from '../../../assets/icons/CancelIcon.svg';


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
  min-height: 60px; /* Для стабильности высоты */

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.span`
  font-size: 1rem;
  color: #555;
`;

const SettingValueDisplay = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  display: block;
  margin-top: 0.25rem;
`;

const ValueInput = styled.input`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  width: 200px; /* или другая подходящая ширина */
`;

const EditControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem; /* Отступ от инпута/значения */
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  
  svg {
    width: 16px; /* Чуть меньше для этих контролов */
    height: 16px;
    fill: #9747FF;
  }
  &:hover svg {
    fill: #7a3bb8;
  }
   &.save svg {
    fill: #2ecc71; 
     &:hover { fill: #27ae60; }
  }
  &.cancel svg {
    fill: #e74c3c; 
    &:hover { fill: #c0392b; }
  }
`;


const ActionLink = styled.button`
  font-size: 0.9rem;
  color: #9747FF;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex; /* Для выравнивания иконки, если будет */
  align-items: center;

  svg {
    margin-right: 0.3rem;
    width: 14px;
    height: 14px;
  }

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

// Props: user, localEmail, localPassword, onEmailChange, onPasswordChange,
// isEditingEmail, onToggleEditEmail, onSaveEmail, onCancelEditEmail,
// isEditingPassword, onToggleEditPassword, onSavePassword, onCancelEditPassword,
// onLogout, onDeleteAccount
export default function AccountSettings({
  user,
  localEmail,
  localPassword,
  onEmailChange,
  onPasswordChange,
  isEditingEmail,
  onToggleEditEmail,
  onSaveEmail,
  onCancelEditEmail,
  isEditingPassword,
  onToggleEditPassword,
  onSavePassword,
  onCancelEditPassword,
  onLogout,
  onDeleteAccount,
}) {
  if (!user) return null;

  return (
    <SettingsContainer>
      <SectionTitle>Аккаунт</SectionTitle>
      <SettingItem>
        <div>
          <SettingLabel>Email</SettingLabel>
          {isEditingEmail ? (
            <ValueInput
              type="email"
              value={localEmail}
              onChange={onEmailChange}
              autoFocus
            />
          ) : (
            <SettingValueDisplay>{user.email}</SettingValueDisplay>
          )}
        </div>
        {isEditingEmail ? (
          <EditControls>
            <ControlButton onClick={onSaveEmail} title="Сохранить email" className="save"><SaveIcon /></ControlButton>
            <ControlButton onClick={onCancelEditEmail} title="Отменить" className="cancel"><CancelIcon /></ControlButton>
          </EditControls>
        ) : (
          <ActionLink onClick={onToggleEditEmail}><EditIcon /> изменить</ActionLink>
        )}
      </SettingItem>

      <SettingItem>
        <div>
          <SettingLabel>Пароль</SettingLabel>
          {isEditingPassword ? (
             <ValueInput
              type="password"
              value={localPassword}
              onChange={onPasswordChange}
              placeholder="Новый пароль"
              autoFocus
            />
          ) : (
            <SettingValueDisplay>********</SettingValueDisplay>
          )}
        </div>
        {isEditingPassword ? (
          <EditControls>
            <ControlButton onClick={onSavePassword} title="Сохранить пароль" className="save"><SaveIcon /></ControlButton>
            <ControlButton onClick={onCancelEditPassword} title="Отменить" className="cancel"><CancelIcon /></ControlButton>
          </EditControls>
        ) : (
          <ActionLink onClick={onToggleEditPassword}><EditIcon /> изменить</ActionLink>
        )}
      </SettingItem>

      <SettingItem>
        <DestructiveActionLink onClick={onDeleteAccount}>Удалить аккаунт</DestructiveActionLink>
      </SettingItem>
      <SettingItem>
        <ActionLink onClick={onLogout}>Выйти</ActionLink>
      </SettingItem>
    </SettingsContainer>
  );
}