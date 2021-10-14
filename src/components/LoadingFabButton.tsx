import LoopIcon from '@mui/icons-material/Loop'
import { Fab } from '@mui/material'

type Props = {
  disabled: boolean
  icon: React.ReactElement
  text: string
  loadingText: string
  loading: boolean
  className?: string
}

export default function LoadingFabButton({
  disabled,
  icon,
  text,
  loadingText,
  loading,
  className,
}: Props) {
  return (
    <Fab
      color="primary"
      type="submit"
      disabled={disabled || loading}
      variant="extended"
      sx={{
        boxShadow: 'none',
        gap: '8px',
      }}
      className={className}
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
