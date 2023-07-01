import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Button from './Button'
import numberWithCommas from '../../utils/numberWithCommas'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from '../../contexts/CartContext'
import { AuthContext } from '../../contexts/AuthContext'
import { OrderContext } from '../../contexts/OrderContext'
import { useHistory } from 'react-router';
import { Modal } from 'antd';
import { toast } from 'react-toastify';

const ProductView = props => {

    const { addToCart } = useContext(CartContext)
    const { setItem } = useContext(OrderContext)
    const { authState: { user } } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const [isShirt, setIsShirt] = useState(true)

    let product = props.product
    let images = props.images

    if (product === undefined) product = {
        name: "",
        price: '',
        image: null,
        categoryID: "",
        color: [],
        discount: "",
        description: ""
    }

    if (images === undefined) {
        images = []
    }

    const history = useHistory()
    const [previewImg, setPreviewImg] = useState(product.image)
    const [descriptionExpand, setDescriptionExpand] = useState(false)
    const [color, setColor] = useState(undefined)
    const [quantity, setQuantity] = useState(1)
    const [suportValue, setSuportValue] = useState({
        suportHeight: 0,
        suportKg: 0,
    })

    const updateQuantity = (type) => {
        if (type === 'plus') {
            if(product?.quantity===0){
                toast.error('Sản phẩm đã hết!');
                return
            }
            else{

                setQuantity(quantity + 1)
            }
        } else {
            setQuantity(quantity - 1 < 1 ? 1 : quantity - 1)
        }
    }

    useEffect(() => {
        setPreviewImg(product?.image)
    }, [product])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 1,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    // initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }
        ]
    }

    const check = () => {
        if (!user) {
            toast.error('Bạn chưa đăng nhập!');
            return false
        }
        if (product.quantity === 0) {
            toast.error('Sản phẩm đã hết!');
            return false
        }
        if (color === undefined) {
            toast.error('Vui lòng chọn màu sắc!');
            return false
        }


        return true
    }

    const addItem = async () => {
        if (check()) {
            let newItem = {
                productId: product._id,
                userId: user._id,
                price: product.discount,
                quantity: quantity,
                total: product.discount * quantity,
                img: product.image,
                productName: product.name,
                color: color,
            }
            if (await addToCart(newItem)) {
                toast.success('Thêm sản phẩm thành công!');
            } else {
                toast.error('Thêm sản phẩm không thành công!');
            }
        }
    }

    const handleSetItem = () => {
        if (check()) {
            let itemData = {
                productId: product._id,
                userId: user._id,
                price: product.discount,
                quantity: quantity,
                total: product.discount * quantity,
                img: product.image,
                productName: product.name,
                color: color,
            }
            setItem(itemData)
            history.push('/OneOrder')
        }
    }


  

    const onChangeSuport = (name) => (e) => {
        setSuportValue({ ...suportValue, [name]: e.target.value });
    };

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    return (
        <div className="product">
            <div className="product__images">

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

                    <div className="product__images__main">
                        <img src={previewImg} alt="" />
                    </div>

                    <div style={{ marginLeft: 50 }}>
                        <Slider {...settings}>
                            {
                                images.map((item, index) => (
                                    <div key={index} onClick={() => setPreviewImg(item.image)}>
                                        <img src={item.image} alt='loading...' />
                                    </div>
                                ))
                            }
                        </Slider>
                    </div>
                </div>

                <div className={`product-description ${descriptionExpand ? 'expand' : ''}`}>
                    <div className="product-description__title">
                        Chi tiết sản phẩm
                    </div>
                    <div className="product-description__content" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                    <div className="product-description__toggle">
                        <Button size="sm" onClick={() => setDescriptionExpand(!descriptionExpand)}>
                            {
                                descriptionExpand ? 'Thu gọn' : 'Xem thêm'
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div className="product__info">
                <h1 className="product__info__title">{product.name}</h1>
                <div className="product__info__item">
                    <span className="product__info__item__price">
                        {numberWithCommas(product.discount)}
                        <span className="product-card__price__old">
                            <del>{numberWithCommas(product.price)}</del>
                        </span>
                    </span>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Số lượng còn lại trong kho: {product?.quantity}
                    </div>
                    <div className="product__info__item__list">
                        Đã bán: {product?.sold}
                    </div>
                </div>
                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Màu sắc
                    </div>
                    <div className="product__info__item__list">
                        {
                            product.color.map((item, index) => (
                                <div key={index} className={`product__info__item__list__item ${color === item ? 'active' : ''}`} onClick={() => setColor(item)}>
                                    <div className={`circle bg-${item}`}></div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    isShirt && <div className="product__info__item">
                        <div style={{ position: 'relative' }}>

                            
                        </div>
                    </div>
                }

                {
                    isShirt && <div className="product__info__item">
                        <div className="product__info__item__title">

                        </div>
                        <div className="product__info__item__list">
                            {
                                
                            }
                        </div>
                    </div>
                }


                <div className="product__info__item">
                    <div className="product__info__item__title">
                        Số lượng
                    </div>
                    <div className="product__info__item__quantity">
                        <div className="product__info__item__quantity__btn" onClick={() => updateQuantity('minus')}>
                            <i className="bx bx-minus"></i>
                        </div>
                        <div className="product__info__item__quantity__input">
                            {quantity}
                        </div>
                        <div className="product__info__item__quantity__btn" onClick={() => updateQuantity('plus')}>
                            <i className="bx bx-plus"></i>
                        </div>
                    </div>
                </div>
                <div className="product__info__item">
                    <Button onClick={() => addItem()} >thêm vào giỏ</Button>

                    <Button onClick={() => handleSetItem()}>mua ngay</Button>


                </div>
            </div>
            <div className={`product-description mobile ${descriptionExpand ? 'expand' : ''}`}>
                <div className="product-description__title">
                    Chi tiết sản phẩm
                </div>
                <div className="product-description__content" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                <div className="product-description__toggle">
                    <Button size="sm" onClick={() => setDescriptionExpand(!descriptionExpand)}>
                        {
                            descriptionExpand ? 'Thu gọn' : 'Xem thêm'
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

ProductView.propTypes = {
    product: PropTypes.object
}

export default withRouter(ProductView)