import { useAuthContext } from '@/contexts/AuthContext'
import { IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { destroyCookie } from 'nookies'

/**
 * Top bar component
 * @returns {JSX.Element}
 */
export default function TopBar() {
  const { username } = useAuthContext()

  return (
    <div>
      {username}
      <IconButton
        color="error"
        onClick={() => {
          destroyCookie(null, 'user')
          location.reload()
        }}
      >
        <LogoutIcon />
      </IconButton>
    </div>
  )
}
