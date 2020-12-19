import { Button, createStyles, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    formButton: {
      height: 48
    }
  })
)

type Props = {
  create: (room: string) => Promise<void>
}

export default function CreateRoomForm({ create }: Props) {
  const classes = useStyles()
  const [room, setRoom] = useState('')

  return (
    <>
      <p>参加したいディスカッションがなければ、ディスカッションを作成してみよう!</p>
      <TextField id="outlined-basic" value={room} onChange={(e) => setRoom(e.target.value)} label="Room Title" variant="outlined" />
      <Button onClick={() => create(room)} className={classes.formButton} variant="contained">作成</Button>
    </>
  )
}