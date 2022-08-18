interface Props {
  size: number
  fillColor: string
}

export interface MainLink {
  link: string
  icon: React.FC<Props>
  title: string
  id: string
  isActive?: boolean
}

export interface OtherLink {
  link: string
  icon: string
  title: string
  id: string
}
