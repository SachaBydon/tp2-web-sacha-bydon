import LoopIcon from '@mui/icons-material/Loop'
import { Fab } from '@mui/material'

type Props = {
  disabled: boolean
  icon: React.ReactElement
  text: string
  loadingText: string
  loading: boolean
}

export default function LoadingFabButton({
  disabled,
  icon,
  text,
  loadingText,
  loading,
}: Props) {
  return (
    <Fab
      color="primary"
      type="submit"
      disabled={disabled || loading}
      variant="extended"
      sx={{
        boxShadow: 'none',
        gap: '8px'
      }}
    >
      {loading ? (
        <>
          <LoopIcon className="rotate-animation" />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </Fab>
  )
}
