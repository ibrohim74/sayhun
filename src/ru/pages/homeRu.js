import React, {useRef, useState, createContext} from 'react';
import {dataUz} from "../../component/db";
import {Button, Modal, Checkbox, Form, Input, InputNumber} from 'antd';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";


const HomeRu = () => {
    const [product, setProduct] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [isActiveBasket, setIsActiveBasket] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [telNumber, setTelNumber] = useState('');
    const navi = useNavigate();

    const totalPrice = product.reduce((a, c) => a + c.price * c.count, 0);
    const handleClick = e => {
        setIsActive(current => !current)
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const basket = e => {
        setIsActiveBasket(current => !current)
    };
    const handleAdd = (e) => {
        const exist = product.find((x) => x.id === e.id);
        if (exist) {
            setProduct(
                product.map((x) =>
                    x.id === e.id ? {...exist, count: exist.count + 1} : x)
            )
        } else {
            setProduct([...product, {...e, count: e.maxMinus}])
        }
    };
    const onRemove = (e) => {
        const exist = product.find((x) => x.id === e.id);
        if (exist.count === e.maxMinus) {
            setProduct(product.filter((x) => x.id !== e.id))
        } else {
            setProduct(product.map((x) =>
                x.id === e.id ? {...exist, count: exist.count - 1} : x
            ))

        }
    };
    const products = dataUz.map((item) => {
        return (
            <div className="sayhun-item" key={item.id}>
                <div className="sayhun-img">
                    <img src={item.img} alt=""/>
                </div>
                <div className="sayhun-text">
                    <div className="sayhun-title">
                        <h1>{item.name} <span>{item.liter}L</span></h1>
                    </div>
                    <div className="sayhun-info">
                        {/*<p>*/}
                        {/*    {item.info}*/}
                        {/*</p>*/}
                        <h3>{item.price} сум за 1 продукт </h3>
                        <p>вы можете заказать не менее {item.count} товаров</p>
                    </div>
                    <div className="sayhun-btn">

                        <button onClick={() => handleAdd(item)}>Добавить в корзину</button>

                    </div>
                </div>
            </div>
        )
    });
    const basketBox = product.map((item) => {
        return (
            <div className="basket-item">
                <div className="basket-img">
                    <img src={item.img} alt=""/>
                </div>
                <div className="count-regular">
                    <button onClick={() => handleAdd(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="white"
                                  d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"/>
                        </svg>
                    </button>
                    <input type="text" value={item.count}/>
                    <button onClick={() => onRemove(item)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="white" d="M18 12.998H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z"/>
                        </svg>
                    </button>
                </div>
                <div className="item-total">
                    <h1>{item.name}</h1>
                    <p>{item.price * item.count} сум</p>
                </div>
            </div>
        )
    });


    const showModal = () => {
        if (product.length === 0) {
            return "Ваша корзина пуста"
        } else {
            setIsModalOpen(true);
        }
    };

    const getUser = () => {
        let errorContent = document.getElementById('error_content');
        let errorBox = document.querySelector('.error-msg');

        if (userName === '') {
            errorContent.innerHTML = "Напишите свое имя";
            errorBox.style.display = 'flex'
            errorBox.style.background = 'rgba(255,0,0, 0.7)';
            setTimeout(() => {
                errorContent.innerHTML = "";
                errorBox.style.display = 'none'
            }, 4000)
        } else {
            if (telNumber === '') {
                errorContent.innerHTML = "Введите свой номер телефона";
                errorBox.style.display = 'flex'
                errorBox.style.background = 'rgba(255,0,0, 0.7)';
                setTimeout(() => {
                    errorContent.innerHTML = "";
                    errorBox.style.display = 'none'
                }, 6000)
            } else {
                if (telNumber.length < 9 ){
                    errorContent.innerHTML = "Образец : +998991234567 или 991234567";
                    errorBox.style.display = 'flex'
                    errorBox.style.background = 'rgba(255,0,0, 0.7)';
                    setTimeout(() => {
                        errorContent.innerHTML = "";
                        errorBox.style.display = 'none'
                    }, 4000)
                }else {
                    let msg = "<b>Заказ размещен</b> ";
                    msg += product.map((item) => "\n"+ item.name + " : " + item.count + "ta : " + item.price * item.count + " сум" + "\n");
                    msg += "\n Общий: " + totalPrice + " сум\n";
                    msg += "\n клиент: " + userName;
                    msg += "\n Номер телефона: " + telNumber;

                    const TOKEN = "6054819816:AAFKboM9WpjFLsq8fPC2cOufW7S5gdF8nYs";
                    const CHAT_ID = "-1001616700443";

                    try {
                        axios.post("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
                            chat_id: CHAT_ID,
                            parse_mode: 'html',
                            text: msg
                        }).then((res) => {
                                errorBox.style.display = 'flex';
                                errorBox.style.background = 'green';
                                errorContent.innerHTML = "Ваш заказ принят";
                                setTimeout(() => {
                                    navi('/');
                                    errorBox.style.display = 'none';
                                    errorContent.innerHTML = "";
                                    errorBox.style.background = 'rgba(255,0,0, 0.7)';
                                }, 2000)
                            }
                        )
                    } catch (e) {
                        if (e) {
                            errorContent.innerHTML = "Системная ошибка !! Попробуйте еще раз";
                            errorBox.style.display = 'flex';
                            errorBox.style.background = 'rgba(255,0,0, 0.7)';
                            setTimeout(() => {
                                errorContent.innerHTML = "";
                                errorBox.style.display = 'none'
                            }, 4000)
                        }
                    }
                }
            }
        }


    };
    return (
        <div>
            <div className="error-msg">
                <h1 id={'error_content'}></h1>
            </div>
            <div className={'nav-box'}>
                <nav>
                    <div className={isActive ? 'active' : ''} id={'icon-nav'} onClick={handleClick}>
                        <svg fill="none" viewBox="0 0 24 24" height="40px" width="100%">
                            <path
                                fill="currentColor"
                                d="M4 6a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM4 18a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM5 11a1 1 0 100 2h8a1 1 0 100-2H5z"
                            />
                        </svg>
                    </div>
                    <div className="menu" id={isActive ? 'active' : ''}>
                        <ul>
                            <li><Link href="#">Разрешение и документы</Link></li>
                            <li><Link href="#">связаться с нами</Link></li>
                            <li><Link href="#">Подавать заявление</Link></li>
                            <li><Link to={'/home'}>UZ</Link> <Link to={'/ru'}>RU</Link></li>

                        </ul>
                    </div>

                    <div className="logo-nav">
                        <img src="https://api.logobank.uz/media/logos_png/sayhun.png" alt=""/>
                    </div>
                    <div className={isActiveBasket ? 'active' : ''} onClick={basket} id={'basket'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="100%" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M5 22h14c1.103 0 2-.897 2-2V9a1 1 0 0 0-1-1h-3V7c0-2.757-2.243-5-5-5S7 4.243 7 7v1H4a1 1 0 0 0-1 1v11c0 1.103.897 2 2 2zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v1H9V7zm-4 3h2v2h2v-2h6v2h2v-2h2l.002 10H5V10z"/>
                        </svg>
                        <span className={'badge'}>{product.length}</span>
                    </div>
                    <div className={isActiveBasket ? 'active' : ''} id={'basket-content'}>
                        <div className={'basket-box'}>
                            <div className="scroll-basket">
                                {basketBox}

                            </div>
                            <div className="total-box">
                                <h2>Общий: {totalPrice} сум</h2>
                                <button
                                    onClick={showModal}>{product.length === 0 ? "Ваша корзина пуста" : "заказать"}</button>
                            </div>
                        </div>
                    </div>
                </nav>

                <Modal title="Информация о заказчике" open={isModalOpen} onCancel={handleCancel}>
                    <div className="modalForm">
                        <div className="form-input">
                            <label>Ваше имя</label>
                            <input type="text" placeholder={"Ваше имя"} value={userName}
                                   onChange={e => setUserName(e.target.value)}/>
                        </div>
                        <div className="form-input">
                            <label>номер телефона</label>
                            <input type="tel" placeholder={"Ваш номер телефона"} value={telNumber}
                                   onChange={e => setTelNumber(e.target.value)} required maxLength={13} minLength={9}/>
                        </div>
                        <button type={'submit'} onClick={getUser}>Отправить</button>
                    </div>
                </Modal>
            </div>
            <div className="container">
                <div className="sayhun-box">
                    {products}
                </div>
            </div>
        </div>
    );
};

export default HomeRu;
