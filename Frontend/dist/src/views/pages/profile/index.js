// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../redux/profileSlice";
import axios from "axios";

// ** Custom Components
import UILoader from '@components/ui-loader'
import Breadcrumbs from '@components/breadcrumbs'

// ** Reactstrap Imports
import { Row, Col, Button } from 'reactstrap'

// ** Demo Components
// import ProfilePoll from './ProfilePolls'
import ProfileAbout from './ProfileAbout'
// import ProfilePosts from './ProfilePosts'
import ProfileHeader from './ProfileHeader'
// import ProfileTwitterFeeds from './ProfileTwitterFeeds'
// import ProfileLatestPhotos from './ProfileLatestPhotos'
// import ProfileSuggestedPages from './ProfileSuggestedPages'
// import ProfileFriendsSuggestions from './ProfileFriendsSuggestions'

// ** Styles
import '@styles/react/pages/page-profile.scss'

const Profile = () => {

const dispatch = useDispatch();
  const profileState = useSelector((state) => state.profile ?? { data: null, loading: false });
const profile = profileState.data;
const loading = profileState.loading;

    useEffect(() => {
    if (!profile) dispatch(fetchProfile());
  }, [dispatch, profile]);
  return (
    <Fragment>
      <Breadcrumbs title='Profile' data={[{ title: 'Pages' }, { title: 'Profile' }]} />
             <div id="user-profile">
        {loading && !profile ?(
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

export default Profile
