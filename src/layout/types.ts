interface Props {
  size: number
  fillColor: string
}

export interface mainLink {
  link: string
  icon: React.FC<Props>
  title: string
  id: string
  isActive?: boolean
}

export interface otherLink {
  link: string
  icon: string
  title: string
  id: string
}
