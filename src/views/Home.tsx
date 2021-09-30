import { Assignments } from '../components'
import { Switch, FormControlLabel } from '@mui/material'
import { useAuthContext } from '../contexts/AuthContext'

export default function Home() {

  return (
    <div id="Home">
      <Assignments />
    </div>
  )
}
