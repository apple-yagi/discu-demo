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

const DiscussionId: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const [roomId, setRoomId] = useState('')
  const [roomTitle, setRoomTitle] = useState('')
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (router.asPath !== router.route) {
      if (typeof router.query.id === "string") {
        setRoomId(router.query.id);
        entryRoom()
      }
    }
  }, [router, roomId])

  const entryRoom = useCallback(() => {
    if (roomId.length) {
      db.collection('rooms').doc(roomId).get().then(doc => {
        if (doc.exists) {
          setRoomTitle(doc.data().title)
          setLoading(false)
        } else {
          router.push('/discussion')
        }
      }).catch(err => {
        alert(err.message)
      })
    }
  }, [roomId])

  const exitRoom = useCallback(() => {
    db.collection('rooms').doc(roomId).delete().then(() => {
      router.push('/discussion')
    }).catch(err => {
      alert(err.message)
    })
  }, [roomId])

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
        <div className="text-center">
          <h1>Room Title: {roomTitle}</h1>
          <button onClick={exitRoom} >退出</button>
        </div>
      }
    </div>
  )
}
export default DiscussionId