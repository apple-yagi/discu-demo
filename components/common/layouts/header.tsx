import Link from 'next/link'
import classes from '../../../styles/common/layouts/Header.module.css'

export default function Header() {
  return (
    <div className={classes.header}>
      <div className="container">
        <Link href="/">
          <a className={classes.header_link}>Home</a>
        </Link>
        <Link href="/discussion">
          <a className={classes.header_link}>Discussion</a>
        </Link>
      </div>
    </div>
  )
}