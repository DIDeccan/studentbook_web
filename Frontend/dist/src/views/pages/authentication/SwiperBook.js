import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

import img1 from '../../../assets/images/banner/img1.png'
import img2 from '../../../assets/images/banner/img2.png'
import img3 from '../../../assets/images/banner/img3.png'
import img4 from '../../../assets/images/banner/img4.png'

const params = {
  modules: [Autoplay, Navigation, Pagination],
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  pagination: {
    clickable: true
  },
  navigation: true
}

const SwiperBook = ({ isRtl }) => {
  return (
    <Card style={{
      boxShadow: 'none',
      border: 'none',
      backgroundColor: 'transparent'
    }}>
      <CardHeader className="d-flex justify-content-center border-0 p-0 mb-2">
        <CardTitle
          tag='h4'
          className="text-center"
          style={{ fontSize: '2.5rem', marginTop: '30px', color: '#1c1d1f', fontWeight: "700" }}
        >
          StudentBook AD's
        </CardTitle>
      </CardHeader>

      <CardBody className="p-0">
        <div style={{ maxWidth: '80%', margin: '0 auto' }}>
          <Swiper dir={isRtl ? 'rtl' : 'ltr'} {...params} className="swiper-autoplay">
            {[img1, img2, img3, img4].map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`slide ${index + 1}`}
                  className='img-fluid object-fit-cover d-block mx-auto'
                  style={{ height: '350px', width: '100%' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CardBody>

    </Card>
  )
}

export default SwiperBook
