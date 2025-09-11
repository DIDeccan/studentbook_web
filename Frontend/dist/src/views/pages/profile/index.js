import { Fragment, useEffect } from 'react'

import { useDispatch, useSelector } from "react-redux";
import { fetchStudentProfile } from "../../../redux/profileSlice";

import UILoader from '@components/ui-loader'
import Breadcrumbs from '@components/breadcrumbs'

import { Row, Col } from 'reactstrap'

import ProfileAbout from './ProfileAbout'
import ProfileHeader from './ProfileHeader'

import '@styles/react/pages/page-profile.scss'

const Profile = () => {
  const dispatch = useDispatch();

  const profileState = useSelector((state) => state.profile ?? { data: null, loading: false });
  const { data: profile, loading } = profileState;

  const authData = useSelector((state) => state.auth?.userData || state.auth?.authData?.user);
  const studentId = authData?.student_id;
  const classId = authData?.course_id || authData?.student_class || profile?.student_packages?.[0]?.course_id;

  useEffect(() => {
  }, [authData, studentId, classId]);

  useEffect(() => {
    if (studentId && classId) {
      dispatch(fetchStudentProfile({ studentId, classId }));
    } else {
      console.warn("Cannot fetch profile - studentId or classId missing", { studentId, classId });
    }
  }, [dispatch, studentId, classId]);

  // --- Log profileState changes ---
  useEffect(() => {
    console.log("Profile state changed:", profileState);
  }, [profileState]);

  return (
    <Fragment>
      <Breadcrumbs title='Profile' data={[{ title: 'Pages' }, { title: 'Profile' }]} />
      <div id="user-profile">
        {loading && !profile ? (
          <UILoader blocking={true} />
        ) : (
          <>
            <ProfileHeader />
            <section id="profile-info">
              <Row>
                <Col lg={{ size: 3, order: 1 }} sm="12" xs={{ order: 2 }}>
                  <ProfileAbout />
                </Col>
              </Row>
            </section>
          </>
        )}
      </div>
    </Fragment>
  )
}

export default Profile;
