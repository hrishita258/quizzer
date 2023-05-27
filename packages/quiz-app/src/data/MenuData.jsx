import { FcGraduationCap, FcSelfie, FcSettings } from 'react-icons/fc'

export const MenuData = [
  {
    key: '1',
    label: 'Setup',
    icon: <FcSettings />,
    children: [
      {
        key: '1-1',
        label: 'User Management',
        role: ['admin', 'spoc'],
        children: [
          {
            key: '1-1-1',
            label: 'User List',
            link: '/users'
          }
        ]
      }
      // {
      //   key: '1-2',
      //   label: 'Specialization Management',
      //   role: ['admin', 'spoc'],
      //   children: [
      //     {
      //       key: '1-2-1',
      //       label: 'Specialization List',
      //       link: 'specializationManagement/specialization-list'
      //     },
      //     {
      //       key: '1-2-2',
      //       label: 'Add Specialization',
      //       link: 'specializationManagement/add-specialization'
      //     }
      //   ]
      // },
      // {
      //   key: '1-3',
      //   label: 'Assign Specialization',
      //   children: [
      //     {
      //       key: '1-3-1',
      //       label: 'Assign Specialization',
      //       role: ['admin', 'spoc'],
      //       link: 'assignSpecialization/assign-specialization'
      //     }
      //   ]
      // }
    ]
  },
  {
    key: '2',
    label: 'Quiz',
    icon: <FcSelfie />,
    children: [
      {
        key: '2-1',
        label: 'Quiz List',
        role: ['admin', 'spoc', 'faculty'],
        link: '/quizzes'
      }
    ]
  },
  {
    key: '3',
    label: 'College Management',
    icon: <FcGraduationCap />,
    role: ['admin'],
    children: [
      {
        key: '3-1',
        label: 'College List',
        link: '/colleges'
      }
    ]
  },
  {
    key: '4',
    label: 'Student Management',
    icon: <FcGraduationCap />,
    role: ['faculty'],
    children: [
      {
        key: '4-1',
        label: 'Assign Quiz',
        link: 'studentManagement/assign-quiz'
      }
    ]
  },

  {
    key: '5',
    label: 'Leader Board',
    icon: <FcGraduationCap />,
    role: ['faculty', 'student', 'spoc'],
    children: [
      {
        key: '5-1',
        label: 'Leader Board',
        link: 'leaderBoard/leader-board'
      }
    ]
  },
  {
    key: '6',
    label: 'Explore',
    icon: <FcGraduationCap />,
    role: ['student'],
    children: [
      {
        key: '6-1',
        label: 'Explore',
        link: 'explore'
      },
      {
        key: '6-2',
        label: 'Explore Opportunities',
        link: 'explore/opportunities'
      },
      {
        key: '6-3',
        label: 'Explore Jobs',
        link: 'explore/jobs'
      },
      {
        key: '6-4',
        label: 'Explore Hackathons',
        link: 'explore/hackathons'
      }
    ]
  },
  {
    key: '7',
    label: 'My Quiz',
    icon: <FcGraduationCap />,
    role: ['student'],
    children: [
      {
        key: '7-1',
        label: 'Current Quiz',
        link: 'myQuiz/my-quiz'
      },
      {
        key: '7-2',
        label: 'Upcoming Quiz',
        link: 'myQuiz/upcoming-quiz'
      },
      {
        key: '7-3',
        label: 'My Quiz Result',
        link: 'myQuiz/my-quiz-result'
      }
    ]
  }
]
