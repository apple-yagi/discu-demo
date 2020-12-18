import { CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { db } from '../../plugins/firebase_config'

const useStyles = makeStyles(() =>
  createStyles({
    circular: {
      marginTop: typeof innerHeight !== 'undefined' ? innerHeight / 2.3 : 100,
    }
  })
)

export default function DiscussionId() {
  const classes = useStyles()
  const router = useRouter()
  const { id } = router.query
  const [roomTitle, setRoomTitle] = useState('')
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    console.log(router)
    if (typeof id === 'undefined') {
      router.push('/discussion')
      return
    }
    entryRoom()
  }, [])

  const entryRoom = useCallback(() => {
    if (typeof id === 'string') {
      db.collection('rooms').doc(id).get().then(doc => {
        if (doc.exists) {
          setRoomTitle(doc.data().title)
          setLoading(false)
        } else {
          router.push('/discussion')
        }
      }).catch(err => {
        alert(err.message)
      })
    } else {
      router.push('/discussion')
    }
  }, [roomTitle, isLoading])

  const loadingScreen = () => {
    return (
      <div className="w-full h-full text-center  fixed block top-0 left-0 bg-blue-100 opacity-75 z-50">
        <CircularProgress className={classes.circular} style={{ width: 100, height: 100 }} />
      </div>
    )
  }

  return (
    <div>
      {isLoading ?
        loadingScreen() :
        <h1>Room Title: {roomTitle}</h1>
      }
    </div>
  )
}