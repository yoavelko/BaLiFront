import './User.css'
import SuggestionBox from '../suggestion-box/SuggestionBox'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../modal/Modal';
import axios from 'axios'
import { getDummyIsrael, getDummyOverall, searchSong, newUser } from '../../../utils/UserRoutes'
import { estabBest } from '../../../utils/Establishment';
import LOGO from './../../../media/LOGO.png'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import cookies from 'js-cookie'

function User() {

    const [data, setData] = useState();
    const [section, setSection] = useState('israel');
    const [input, setInput] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        if (!cookies.get('establishment')) navigate('/error')
        if (!cookies.get('userId')) {
            axios.get(newUser)
                .then((res) => {
                    console.log(res);
                    cookies.set('userId', res.data._id, { expires: 0.25 })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [])

    useEffect(() => {
        if (section === 'israel' || section === 'overall') {
            axios.get(section === 'israel' ? getDummyIsrael : section === 'overall' && getDummyOverall)
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        } else if (section === 'establishment') {
            axios.post(estabBest, {
                establishment: cookies.get('establishment')
            })
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [section])

    function handleSearch() {
        axios.post(searchSong, {
            input: input
        })
            .then((res) => {
                setData(res.data)
                setSection('search')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    showModal ? disableBodyScroll(document) : enableBodyScroll(document)

    return (
        <>
            <div id='user-container' dir='rtl'>
                <div id='user-establishment-container'>
                    <div id='establishment-preslogan'>IT'S</div>
                    <div id='establishment-logo'>
                        <img width={80} src={LOGO} alt="" />
                    </div>
                    <div id='establishment-slogan'>SHARE YOUR TASTE</div>
                </div>
                <div id='user-search-container'>
                    <input id='user-searchbar' type="text" placeholder=' חפש...' onChange={(e) => { setInput(e.target.value) }} onKeyDown={handleKeyPress} />
                    <div id='user-search-breaker'></div>
                    <button id='search-button' onClick={handleSearch}>חפש</button>
                </div>
                <div id='user-suggestion-container'>
                    {data && data.map((value, index) => {
                        return <SuggestionBox key={index} video={value} setShowModal={setShowModal} setModalContent={setModalContent} />
                    })}
                </div>
                <div id='user-footer'>
                    <div onClick={() => {setSection('israel'), window.scrollTo({top: 0, behavior: 'smooth'})}}>ישראל</div>
                    <div>|</div>
                    <div onClick={() => {setSection('overall'), window.scrollTo({top: 0, behavior: 'smooth'})}}>עולמי</div>
                    <div>|</div>
                    <div onClick={() => {setSection('establishment'), window.scrollTo({top: 0, behavior: 'smooth'})}}>UP2U</div>
                </div>
            </div>
            {showModal && createPortal(
                <Modal onClose={() => setShowModal(false)} modalContent={modalContent} />,
                document.body
            )}
        </>
    )
}

export default User