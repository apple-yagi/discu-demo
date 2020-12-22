import { createStyles, makeStyles, TextField } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, useRef } from 'react'
import firebase, { db } from '../../plugins/firebase_config'
import DiscussionMessage from '../../components/discussion/molecules/message/DiscussionMessage'
import { Room } from '../../types/Room'
import LoadingScreen from '../../components/common/loading/LoadingScreen'

const useStyles = makeStyles(() => createStyles({
  messageBox: {
    maxWidth: 1024,
    height: process.browser ? window.innerHeight - 100 : '80vh',
    overflow: 'auto',
  }
}))

const DiscussionId = () => {
  const classes = useStyles()
  const router = useRouter()
  const [roomId, setRoomId] = useState('')
  const [room, setRoom] = useState<Room>()
  const [opinion, setOpinion] = useState('')
  const [isLoading, setLoading] = useState(true)
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (router.asPath !== router.route) {
      if (typeof router.query.id !== "string") return

      setRoomId(router.query.id)
      entryRoom(router.query.id)
    }
  }, [router])

  useEffect(() => {
    if (room && isLoading) {
      setLoading(false)
    }
  }, [room])

  useEffect(() => {
    if (!isLoading) {
      scrollToBottomOfList()
    }
  }, [isLoading, room])

  const entryRoom = useCallback((id: string) => {
    db.collection('rooms').doc(id).onSnapshot(doc => {
      if (doc.exists) {
        setRoom({ id: doc.id, ...doc.data() } as Room)
      } else {
        router.push('/discussion')
      }
    }, onerror => {
      console.log(onerror)
      alert('firestoreからデータを取得できませんでした')
    })
  }, [])

  const exitRoom = useCallback(() => {
    db.collection('rooms').doc(roomId).delete().then(() => {
      router.push('/discussion')
    }).catch(err => {
      alert(err.message)
    })
  }, [roomId])

  const sendMessage = useCallback(async () => {
    try {
      // メッセージを登録
      const docs = await db.collection('opinions').add({ text: opinion })
      // ルームとメッセージを関係
      await db.collection("rooms").doc(roomId).update({ opinions: firebase.firestore.FieldValue.arrayUnion(docs.id) })
    } catch (err) {
      alert(err.message)
    }
  }, [opinion])

  const scrollToBottomOfList = useCallback(() => {
    el!.current.scrollIntoView({
      behavior: 'auto',
      block: 'end'
    })
  }, [])

  return (
    <div>
      {isLoading ?
        <LoadingScreen /> :
        <div className="text-center">
          <h1>{room.title}</h1>
          <div className={classes.messageBox}>
            {room.opinions &&
              room.opinions.map(opinion => (
                <DiscussionMessage key={opinion} opinionId={opinion} />
              ))
            }
            <div>
              <TextField value={opinion} ref={el} onChange={(e) => setOpinion(e.target.value)} variant="outlined" />
              <button onClick={sendMessage} >送信</button>
            </div>
            <button onClick={exitRoom} >退出</button>
          </div>
        </div>
      }
    </div >
  )
}
export default DiscussionId