export const LINKS_CONSTANT = [
    {
        value: 'Мои билеты',
        path: '/order',
        iconPath: '/static/icons/ticket_accent.svg'
    },
    {
        value: 'Профиль',
        path: '/profile',
        iconPath: '/static/icons/user_accent.svg'
    },
    {
        value: 'Настройки',
        path: '/settings',
        iconPath: '/static/icons/setting_accent.svg'
    },
]

export const OTHER_LINKS = [
    {
        value: 'Вернуть билет',
        path: '/return-order',
        iconPath: '/static/icons/return-arrow_accent.svg'
    },
    {
        value: 'Частые вопросы',
        path: '/FAQ',
        iconPath: '/static/icons/question-mark_accent.svg'
    },
    {
        value: 'Тех. поддержка',
        path: '/tech-support',
        iconPath: '/static/icons/tech-support_accent.svg'
    },
]

export const DEFAULT_USER = {
  userName: 'Гость',
  email: '',
  imageUrl: '/static/default/default-user.svg',
  role: 'USER',
  cityId: '',
}