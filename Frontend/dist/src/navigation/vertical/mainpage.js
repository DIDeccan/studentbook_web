// ** Icons Import
import { User, Circle, BookOpen, Book, Heart, Target } from 'react-feather'

export default [
      {
        id: 'analyticsDash',
        title: 'Academy',
        icon: <BookOpen size={12} />,
        navLink: '/mainpage'
      },
        {
        id: 'mysubjectsView',
        title: 'Subjects',
        icon: <Book size={12} />,
        navLink: '/mysubjects'
      },
           {
        id: 'yogaView',
        title: 'YogaTips',
        icon: <User  size={12} />,
        navLink: '/yogatips'
      },
         {
        id: 'sportsView',
        title: 'Sports',
        icon: <Target size={12} />,
        navLink: '/sports'
      },
               {
        id: 'healthView',
        title: 'Health',
        icon: <Heart size={12} />,
        navLink: '/health'
      },
            {
        id: 'blogsView',
        title: 'Blogs',
        icon: <Circle size={12} />,
        navLink: '/blogs'
      }
  
]
