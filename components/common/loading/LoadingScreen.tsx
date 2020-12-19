import { CircularProgress, createStyles, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() =>
  createStyles({
    circular: {
      marginTop: typeof innerHeight !== 'undefined' ? innerHeight / 2.3 : 100,
    }
  })
)

export default function LoadingScreen() {
  const classes = useStyles()

  return (
    <div className="w-full h-full text-center  fixed block top-0 left-0 bg-blue-100 opacity-75 z-50">
      <CircularProgress className={classes.circular} style={{ width: 100, height: 100 }} />
    </div>
  )
}