import { CircularProgress, createStyles, makeStyles } from '@material-ui/core'
import { NextPage, NextPageContext } from 'next'
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

type Props = {
  id: string | string[]
}

const DiscussionId: NextPage<Props> = (props) => {
  const classes = useStyles()
  const router = useRouter()
  const id = props.id
  const [roomTitle, setRoomTitle] = useState('')
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (process.browser) {
      entryRoom()
    }
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

  const exitRoom = useCallback(() => {
    if (typeof id === 'string') {
      db.collection('rooms').doc(id).delete().then(() => {
        router.push('/discussion')
      }).catch(err => {
        alert(err.message)
      })
    }
  }, [])

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

DiscussionId.getInitialProps = async (context: NextPageContext): Promise<any> => {
  const { id } = context.query
  return {
    id: id, // will be passed to the page component as props
  }
}

export default DiscussionId