import './App.css'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { SubjectInput } from './components/SubjectInput'

function App() {

  return (
    <div>
      <Header />
      <div className="bg-blue-500">
        <h1 className="text-8xl text-center text-white font-bold pt-40">Unleash Infinite Learning<br></br> with AI-Powered Insights</h1> 
        <p className="text-3xl text-center text-white pt-14 pb-8 leading-10">Simply enter your topic below, or record your voice with the details.<br></br>
        A personalized learning experience will generate from your topic.</p>
      </div>
      <div className="bg-blue-500 min-h-screen rounded-b-md flex">
        <div className="w-full">
          <SubjectInput /> 
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
