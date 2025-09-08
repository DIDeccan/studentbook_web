// ** Third Party Components
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper'

// ** Swiper Styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap'

// ** Images
import img1 from '../../../assets/images/banner/img1.png'
import img2 from '../../../assets/images/banner/img2.png'
import img3 from '../../../assets/images/banner/img3.png'
import img4 from '../../../assets/images/banner/img4.png'

const params = {
  modules: [Autoplay, Navigation, Pagination],
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false
  },
  pagination: {
    clickable: true
  },
  navigation: true
}

const SwiperBook = ({ isRtl }) => {
  return (
    <Card style={{ boxShadow: 'none', border: 'none', backgroundColor: 'transparent' }}>
      <CardHeader className="d-flex justify-content-center border-0 p-0 mb-5">
        <CardTitle
          tag='h2'
          className="fw-bold text-primary text-center"
           style={{
              background: "linear-gradient(90deg, #7db2ddff, #e52e71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: '3rem', letterSpacing: '2px'
            }}
        >
          Explore StudentBook AD's
        </CardTitle>
      </CardHeader>

      <CardBody className="p-0">
        <div style={{ maxWidth: '95%', margin: '0 auto', borderRadius: '25px', overflow: 'hidden' }}>
          <Swiper dir={isRtl ? 'rtl' : 'ltr'} {...params} className="swiper-autoplay">
            {[img1, img2, img3, img4].map((img, index) => (
              <SwiperSlide key={index}>
                <div style={{ position: 'relative', borderRadius: '25px', overflow: 'hidden' }}>
                  <img
                    src={img}
                    alt={`slide ${index + 1}`}
                    className='img-fluid w-100'
                    style={{
                      height: '450px',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease-in-out',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      padding: '25px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      color: '#fff',
                      textAlign: 'center'
                    }}
                  >
                    <h4 style={{ fontWeight: '700', marginBottom: '10px', fontSize: '1.8rem' }}>
                      Learn. Play. Grow.
                    </h4>
                    <p style={{ fontSize: '1rem', marginBottom: '15px' }}>
                      Interactive content & quizzes for Classes 6 to 10.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CardBody>
    </Card>
  )
}

export default SwiperBook
