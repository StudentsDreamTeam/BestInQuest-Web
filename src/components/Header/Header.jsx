import { useState, useEffect } from 'react'
import { styled } from 'styled-components'

const HeaderComponent = styled.header`
  background: #fff;
  color: #434343;
  display: flex;
  justify-content: space-between;
  height: 4rem;
  border-bottom: 0.2rem solid #d9d9d9;
  font-size: 24px;
  font-weight: 600;
`

export default function Header() {
  const [ currentDate, setCurrentDate ] = useState(new Date())
  const options = { month: 'long', day: 'numeric' }

  useEffect(() => {
    const interval = setInterval(() => setCurrentDate(new Date()), 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <HeaderComponent>
      <div>BestInQuest</div>
      <div>{currentDate.toLocaleDateString('en-US', options)}</div>
    </HeaderComponent>
  )
}
