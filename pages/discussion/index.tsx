import { Router } from 'next/dist/client/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { db } from '../../plugins/firebase_config'

export default function Discussion() {
  const [room, setRoom] = useState('')
  const router = useRouter()

  const createRoom = useCallback(() => {
    db.collection('rooms').add({ title: room }).then(docs => {
      router.push(`/discussion/${docs.id}`)
    }).catch(err => {
      console.error(err)
    })
  }, [room])

  return (
    <div className="text-center">
      <div>Discussion Page</div>
      <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
      <button onClick={createRoom}>作成</button>
    </div>
  )
}