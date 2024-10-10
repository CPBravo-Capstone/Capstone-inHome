import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className='footer footer-center p-10 bg-base-200 text-base-content rounded'>
                <nav className='grid grid-flow-col gap-4'>
                    <Link to="/about/"  className='link link-hover'>About us</Link>
                    <a className='link link-hover'>Contact</a>
                    <a className='link link-hover'>Help</a>
                </nav>
                <aside>
                    <p>Copyright © 2024 - All right reserved by inHome Real Estate Solutions</p>
                </aside>
            </footer>
        </>
    )
}

