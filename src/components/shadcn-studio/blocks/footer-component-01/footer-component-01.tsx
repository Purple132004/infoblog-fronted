import { SiFacebook, SiInstagram, SiYoutube, SiX } from '@icons-pack/react-simple-icons'
import { Separator } from '@/components/ui/separator'
import InkLogo from '@/assets/svg/ink-logo'
import { Link } from 'react-router'
import type { NavigationSection } from '../menu-navigation'

type FooterProps = {
  navigationData: NavigationSection[]
}

const Footer = (props: FooterProps) => {
  const { navigationData } = props;
  return (
    <footer>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8'>
        <Link to='/'>
          <div className='flex items-center gap-3 w-32'>
            <InkLogo />
          </div>
        </Link>

        <div className='flex items-center gap-5 whitespace-nowrap'>
          {navigationData.map((navigationItem, i) => (
            <Link key={i} to={navigationItem.href || "#"} className='opacity-80 transition-opacity duration-300 hover:opacity-100 capitalize'>
              {navigationItem.title}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <Link to='#' target='_blank'>
            <SiFacebook className='size-5' />
          </Link>
          <Link to='#' target='_blank'>
            <SiInstagram className='size-5' />
          </Link>
          <Link to='#' target='_blank'>
            <SiX className='size-5' />
          </Link>
          <Link to='#' target='_blank'>
            <SiYoutube className='size-5' />
          </Link>
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <Link to='#' className='hover:underline'>
            shadcn/studio
          </Link>
          , Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
