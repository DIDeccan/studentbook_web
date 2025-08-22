import { Col } from "reactstrap"
import HeroBanner from "./components/HeroBanner"
import SwiperBook from "../pages/authentication/SwiperBook"
import CategoryCards from "./components/CategoryCards"
// import FAQSection from "./components/FAQsection"
const MainPage = () => {
return (
  <Col>
  <HeroBanner/>
  <SwiperBook/>
  <CategoryCards/>
  {/* <FAQSection/> */}
  </Col>
)
}

export default MainPage