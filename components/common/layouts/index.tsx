import Header from './header'

export default function Layouts({ children }) {
  return (
    <div>
      <Header />
      <div className="container">
        {children}
      </div>
    </div>
  )
}