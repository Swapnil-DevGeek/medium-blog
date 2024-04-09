import Quote from '../components/Quote'
import Auth from '../components/Auth'

const Signup = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      <div className=' h-screen flex justify-center items-center '>
        <Auth type='signup'/>
      </div>
      <div className='hidden lg:block '>
        <Quote/>
      </div>
    </div>
  )
}

export default Signup
