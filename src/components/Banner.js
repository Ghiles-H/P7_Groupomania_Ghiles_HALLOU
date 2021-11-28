import logoBlack from '../assets/groupomania_assets/icon-left-font-monochrome-black.png'
import '../styles/Banner.css'

const Banner = () => {
    return (
        <div className='gp-banner'>
            <img src={logoBlack} alt='groupomania' className='gp-logo' />
            
        </div>
    )
}
export default Banner;