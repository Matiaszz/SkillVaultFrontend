'use client';
import { useTheme } from './utils';
import './styles/home/home_style.scss';

const Home = () => {
    const theme = useTheme();

    return (
        <>
            <section className={`section ${theme}`}>
                <h1>Hellow</h1>
            </section>
            {/* <section className={` hero ${theme !== 'dark' ? 'hero-dark' : 'hero-light'}`} >
                <h1>Hellow</h1>

            </section> */}
        </>

    );
};

export default Home;