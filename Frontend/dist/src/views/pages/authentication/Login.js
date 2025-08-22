import {useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import useJwt from '@src/auth/jwt/useJwt'
import toast from 'react-hot-toast'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, X } from 'react-feather'
import { AbilityContext } from '@src/utility/context/Can'
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'
import { getHomeRouteForLoggedInUser } from '@utils'

import {
  Container,
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip
} from 'reactstrap'

import illustrationsLight from '@src/assets/images/pages/login-v2.svg'
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg'

import '@styles/react/pages/page-authentication.scss'
// import { getProfile, loginUser, logout } from '../../../redux/authentication'
import SwiperBook from './SwiperBook'
import Classcard from './ClassCard'
import WhyChooseUs from './WhyChooseUs'
import Register from './Register'
import LoginBasic from './LoginBasic'
import Footer from '../../../@core/layouts/components/footer'
import PaymentModal from "./PaymentModal";

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>You have successfully logged in as an {role} user to Student Book. Now you can start to explore. Enjoy!</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: 'admin',
  loginEmail: 'admin@demo.com'
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight
  // useEffect(() => {
  //   if (!window.Razorpay) {
  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.async = true;
  //     script.onload = () => console.log("✅ Razorpay SDK loaded");
  //     script.onerror = () => console.error("❌ Failed to load Razorpay SDK");
  //     document.body.appendChild(script);
  //   }
  // }, []);
// modals 
   const [modalOpen, setModalOpen] = useState(false)
   const [loginModalOpen, setLoginModalOpen] = useState(false)
  const toggleModal = () => setModalOpen(!modalOpen)
   const toggleLoginModal = () => setLoginModalOpen(!loginModalOpen)

  
const [registerOpen, setRegisterOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  return (
    // <div className='auth-wrapper auth-cover'>
    <div>
      {/* new code starts here */}
    <div className="hero-wrapper" style={{ height: '75px' }}>
      <div className="d-flex align-items-center justify-content-between px-3 py-2">
        <Link className="d-flex align-items-center text-decoration-none" to="/">
          <svg viewBox="0 0 139 95" version="1.1" height="28">
            <defs>
              <linearGradient x1="100%" y1="10.5120544%" x2="50%" y2="89.4879456%" id="linearGradient-1">
                <stop stopColor="#000000" offset="0%" />
                <stop stopColor="#FFFFFF" offset="100%" />
              </linearGradient>
              <linearGradient x1="64.0437835%" y1="46.3276743%" x2="37.373316%" y2="100%" id="linearGradient-2">
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%" />
                <stop stopColor="#FFFFFF" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="none" fillRule="evenodd">
              <g transform="translate(-400, -178)">
                <g transform="translate(400, 178)">
                  <path
                    d="M0,0 L39.18,0 L69.34,32.25 L101.42,0 L138.78,0 V29.8C137.95,37.35 135.78,42.55 132.26,45.41C128.73,48.28 112.33,64.52 83.06,94.14 H56.27 L6.71,44.41 C2.46,39.98 0.34,35.10 0.34,29.80 C0.34,24.49 0.23,14.56 0,0 Z"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <path
                    d="M69.34,32.25 L101.42,0 H138.78 V29.8 C137.95,37.35 135.78,42.55 132.26,45.41 C128.73,48.28 112.33,64.52 83.06,94.14 H56.27 L32.84,70.5 L69.34,32.25 Z"
                    fill="url(#linearGradient-1)"
                    opacity="0.2"
                  />
                  <polygon
                    fill="#000000"
                    opacity="0.05"
                    points="69.39 32.42 32.84 70.5 54.04 16.18"
                  />
                  <polygon
                    fill="#000000"
                    opacity="0.1"
                    points="69.39 32.42 32.84 70.5 58.36 20.74"
                  />
                  <polygon
                    fill="url(#linearGradient-2)"
                    opacity="0.1"
                    points="101.42 0 83.06 94.14 130.37 47.07"
                  />
                </g>
              </g>
            </g>
          </svg>
          <h4 className="text-primary fw-bold mb-0 ms-2">StudentBook</h4>
        </Link>

        <div>
          {/* <Button outline color="primary" className="me-2" onClick={() => setRegisterOpen(true)}>
            Sign Up
          </Button> */}
          <Button
    outline
    color="primary"
    className="me-2"
    onClick={() => {
      const token = localStorage.getItem("accessToken"); // or whatever key you stored after OTP verification

      if (token) {
        // OTP already verified → open PaymentModal
        setPaymentOpen(true);
      } else {
        // New user → open RegisterModal
        setRegisterOpen(true);
      }
    }}
  >
    Sign Up
  </Button>
            <Button color="primary" className="me-2" onClick={toggleLoginModal}>Log In</Button>
        </div>
      </div>
       <Register
  isOpen={registerOpen}
  toggle={() => setRegisterOpen(!registerOpen)}
  openPayment={() => {
    setRegisterOpen(false);
    setPaymentOpen(true);
  }}
/>

<PaymentModal
  isOpen={paymentOpen}
  toggle={() => setPaymentOpen(!paymentOpen)}
/>

    {/* <Register
        isOpen={modalOpen}
        toggle={toggleModal}
        openLogin={() => {
          setModalOpen(false)
          setLoginModalOpen(true)
        }}
      /> */}

      <LoginBasic
        isOpen={loginModalOpen}
        toggle={toggleLoginModal}
        openRegister={() => {
          setLoginModalOpen(false)
          setModalOpen(true)
        }}
      />

    </div>
       <Container fluid className="d-flex flex-column flex-lg-row align-items-center justify-content-between px-5 pb-5 pt-2 hero-content">
        <div className="text-start pt-5" style={{ maxWidth: '600px' }}>
          <h1 className="display-4 fw-bold">Your Course</h1>
          <h1 className="display-4 fw-bold text-primary">To Success</h1>
          <p className="text-muted mt-3">
            Learning made fun, interactive, and effective — specially designed for students from Classes 6 to 10.
          </p>
          <p className="text-muted">
            Explore subjects, quizzes, and live doubt-solving with top educators.
          </p>
          <div className="mt-4">
            <Button color="primary" className="me-2">
              Ready to Get Started?
            </Button>
            <Button outline color="dark">
              Watch Demo Video
            </Button>
          </div>
          <p className="text-muted mt-3">Trusted by 10,000+ Students Across India</p>
        </div>

        <div className="pt-4 pt-lg-0">
          <img className='img-fluid' src={source} alt='Login Cover' />
        </div>
      </Container>
    <div>
<SwiperBook/>
<Classcard/>
<WhyChooseUs/>
<Footer/>
    </div>


    </div>
  )
}

export default Login
