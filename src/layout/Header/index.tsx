import Launch from '../../components/Launch';
import LogoDark from '../../assets/logo-dark.svg';
import LogoLight from '../../assets/logo-light.svg';
import LogoMobile from '../../assets/logo-mobile.svg';
import { GoogleButton } from 'react-google-button';

interface HeaderProps {
  colorTheme: string;
  isSignedIn: boolean;
}

const Header = (props: HeaderProps) => {
  const colorTheme = props.colorTheme;
  const isSignedIn = props.isSignedIn;

  const LogoImg = colorTheme === 'dark' ? LogoLight : LogoDark;

  return (
    <div className='Header'>
      <picture className='Header__Logo'>
        <source srcSet={LogoMobile} media='(max-width: 767px)' />
        <img src={LogoImg} />
      </picture>
      {isSignedIn &&
        <Launch />
      }
    </div>
  );
};

export default Header;
