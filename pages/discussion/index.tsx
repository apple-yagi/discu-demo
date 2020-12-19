import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { db } from '../../plugins/firebase_config'
import CreateRoomForm from '../../components/discussion/form/CreateRoomForm'
import { Room } from '../../types/Room';
import LoadingScreen from '../../components/common/loading/LoadingScreen'
import Link from 'next/link';

export default function Discussion() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[] | null>(null)

  useEffect(() => {
    const rs: Room[] = []
    db.collection("rooms").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        rs.push({ id: doc.id, ...doc.data() } as Room)
      });
    }).finally(() => {
      setRooms([...rs])
    })
  }, [])

  const createRoom = useCallback(async (room: string) => {
    db.collection('rooms').add({ title: room }).then(docs => {
      router.push(`/discussion/${docs.id}`)
    }).catch(err => {
      console.error(err)
    })
  }, [])

  return (
    <div className="text-center">
      <h1>Discussion 一覧ページ</h1>
      <CreateRoomForm create={createRoom} />
      {rooms === null ?
        <LoadingScreen /> :
        <ul>
          {rooms.map(room => (
            <li key={room.id}>
              <Link href={`/discussion/${room.id}`} >
                <a>{room.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}