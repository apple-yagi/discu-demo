import { TextField } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import firebase, { db } from '../../plugins/firebase_config'
import DiscussionMessage from '../../components/discussion/message/DiscussionMessage'
import { Room } from '../../types/Room'
import LoadingScreen from '../../components/common/loading/LoadingScreen'

const DiscussionId: React.FC = () => {
  const router = useRouter()
  const [roomId, setRoomId] = useState('')
  const [room, setRoom] = useState<Room>()
  const [opinion, setOpinion] = useState('')
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
      db.collection('rooms').doc(roomId).onSnapshot(doc => {
        if (doc.exists) {
          setRoom({ id: doc.id, ...doc.data() } as Room)
          setLoading(false)
        } else {
          router.push('/discussion')
        }
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

  return (
    <div>
      {isLoading ?
        <LoadingScreen /> :
        <div className="text-center">
          <h1>{room.title}</h1>
          {typeof room.opinions !== 'undefined' &&
            room.opinions.map(opinion => (
              <DiscussionMessage key={opinion} opinionId={opinion} />
            ))
          }
          <div>
            <TextField value={opinion} onChange={(e) => setOpinion(e.target.value)} variant="outlined" />
            <button onClick={sendMessage} >送信</button>
          </div>
          <button onClick={exitRoom} >退出</button>
        </div>
      }
    </div >
  )
}
export default DiscussionId