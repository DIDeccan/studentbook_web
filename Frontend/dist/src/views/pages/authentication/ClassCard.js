import { useEffect, useState } from 'react'
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap'
import video1 from '@src/assets/videos/video1.mp4'
import video2 from '@src/assets/videos/video2.mp4'
import video3 from '@src/assets/videos/video3.mp4'
import Register from './Register' 

const Classcard = () => {
  const classData = [
    { title: 'Class 6', text: 'Start your journey with engaging video lessons.', video: video1 },
    { title: 'Class 7', text: 'Explore topics with fun and visual explanations.', video: video2 },
    { title: 'Class 8', text: 'Strengthen your base with conceptual clarity.', video: video3 },
    { title: 'Class 9', text: 'Level up with smart study and practice content.', video: video3 },
    { title: 'Class 10', text: 'Crack your board exams with expert lessons.', video: video3 }
  ]

  const [columns, setColumns] = useState(5)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const toggleRegister = () => setIsRegisterOpen(!isRegisterOpen)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 480) setColumns(1)
      else if (width < 768) setColumns(2)
      else if (width < 992) setColumns(3)
      else if (width < 1200) setColumns(4)
      else setColumns(5)
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  const handleSubscribe = () => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData && userData.accessToken) {
    } else {
      toggleRegister()
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <h4
        className="display-4 text-primary"
        style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '24px' }}
      >
        Student Access
      </h4>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '24px',
          padding: '24px'
        }}
      >
        {classData.map((cls, i) => (
          <Card key={i} style={{ width: '100%' }}>
            <video controls style={{ width: '100%', borderRadius: '4px' }}>
              <source src={cls.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <CardBody>
              <CardTitle tag="h4">{cls.title}</CardTitle>
              <CardText>{cls.text}</CardText>
              <Button
                color="primary"
                block
                onClick={handleSubscribe}
              >
                Subscribe
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Register
        isOpen={isRegisterOpen}
        toggle={toggleRegister}
        openLogin={() => {
          toggleRegister()
        }}
      />
    </div>
  )
}

export default Classcard
