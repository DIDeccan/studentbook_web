// ** Icons Import
import { Home, Circle, BookOpen } from 'react-feather'

export default [
  {
    id: 'mainpage',
    title: 'Academy',
    icon: <BookOpen size={20} />,
    badge: 'light-warning',
    children: [
      {
        id: 'analyticsDash',
        title: 'MainPage',
        icon: <Circle size={12} />,
        navLink: '/mainpage'
      },
        {
        id: 'mysubjectsView',
        title: 'MySubjects',
        icon: <Circle size={12} />,
        navLink: '/mysubjects'
      },
           {
        id: 'yogaView',
        title: 'YogaTips',
        icon: <Circle size={12} />,
        navLink: '/yogatips'
      },
         {
        id: 'sportsView',
        title: 'Sports',
        icon: <Circle size={12} />,
        navLink: '/sports'
      },
               {
        id: 'healthView',
        title: 'Health',
        icon: <Circle size={12} />,
        navLink: '/health'
      },
            {
        id: 'blogsView',
        title: 'Blogs',
        icon: <Circle size={12} />,
        navLink: '/blogs'
      }
    ]
  }
]
