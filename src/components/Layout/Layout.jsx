import userAvatar from '../../img/userAvatar.png'

import { useState } from 'react'
import { styled } from 'styled-components'

import Sidebar from "../Sidebar/Sidebar"
import Main from "../Main/Main"
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import CreateTaskForm from '../CreateTaskForm/CreateTaskForm'


const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

export default function Layout() {
  const [ menuTab, setMenuTab ] = useState('Сегодня')
  const [ sidebarTab, setSidebarTab ] = useState('Сегодня')

  const [ isCreateTaskModalOpen, setIsCreateTaskModalOpen ] = useState(false)


  function changeTab(current) {
    (current !== 'Добавить задачу') ? (
      setMenuTab(current)
    ) : (
      setIsCreateTaskModalOpen(true)
    )
    setSidebarTab(current)
  }

  const menuItems = [ 'Добавить задачу', 'Сегодня', 'Магазин', 'Награды', 'Инвентарь', 'Достижения' ]

  const user = {
    avatar: userAvatar,
    name: 'Василий Пупкин',
    level: 1,
    points: 200,
  };

  return (
    <LayoutContainer>

      <Sidebar
        user={user}
        active={sidebarTab}
        onChange={changeTab}
        menuItems={menuItems}
      />

      <Main active={menuTab}></Main>

      <Modal
        open={isCreateTaskModalOpen}
        modelType={'default'}
      >
        <CreateTaskForm
          onClose={() => setIsCreateTaskModalOpen(false)}
        >
        </CreateTaskForm>
      </Modal>

    </LayoutContainer>      
  );
}