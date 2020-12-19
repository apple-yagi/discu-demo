import { CircularProgress, createStyles, makeStyles } from "@material-ui/core"
import { useState, useEffect, useCallback } from "react"
import { db } from "../../../plugins/firebase_config"
import { Opinion } from "../../../types/Opinion"

const useStyles = makeStyles(() =>
  createStyles({
    message: {
      borderRadius: "20%",
      width: 150,
      height: 100,
      textAlign: "center",
      backgroundColor: "#a58eff"
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

  return (
    <div className={classes.message}>
      {isLoading ?
        <CircularProgress style={{ width: 20, height: 20 }} /> :
        <span>{opinion.text}</span>
      }
    </div>
  )
}