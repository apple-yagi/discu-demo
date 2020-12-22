import { CircularProgress, createStyles, makeStyles } from "@material-ui/core"
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useState, useEffect, useCallback } from "react"
import { db } from "../../../../plugins/firebase_config"
import { Opinion } from "../../../../types/Opinion"

const useStyles = makeStyles(() =>
  createStyles({
    message: {
      width: '100%',
      textAlign: "start"
    },
    userIcon: {
      fontSize: "40px",
      "@media (max-width: 480px)": {
        fontSize: "25px"
      },
    }
  })
)

type Props = {
  opinionId: string
}

export default function DiscussionMessage({ opinionId }: Props) {
  const classes = useStyles()
  const [opinion, setOpinion] = useState<Opinion>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    loadOpinion()
  }, [opinionId])

  const loadOpinion = useCallback(async () => {
    try {
      const docs = await db.collection('opinions').doc(opinionId).get()
      if (!docs.exists) {
        throw 'Docs not Exists!'
      }
      setOpinion(docs.data() as Opinion)
    } catch (err) {
      console.error(err)
      setOpinion({ text: 'Opinionの取得に失敗しました' })
    }
    setLoading(false)
  }, [opinionId])

  const message = (text: string) => {
    return (
      <div className="d-flex">
        <AccountCircleIcon className={classes.userIcon} style={{ verticalAlign: 'middle' }} />
        <span style={{ verticalAlign: 'middle' }}>{text}</span>
      </div>
    )
  }

  return (
    <div className={classes.message}>
      {isLoading ?
        <CircularProgress style={{ width: 20, height: 20 }} /> :
        message(opinion.text)
      }
    </div>
  )
}