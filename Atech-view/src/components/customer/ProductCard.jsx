import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import numberWithCommas from '../../utils/numberWithCommas'
import { ProductContext } from "../../contexts/ProductContext";
import { ImageContext } from '../../contexts/ImageContext';
import { ReviewContext } from "../../contexts/ReviewContext"
import './styles.css'
const ProductCard = props => {
const {_id} = props
    const { findProduct } = useContext(ProductContext)
    const { getAllImages } = useContext(ImageContext)
    const { getAllReview } = useContext(ReviewContext)

    const chooseProduct = async (productID) => {
        await findProduct(productID)
        await getAllImages({ productID: productID })
        getAllReview()
    }


    return (
        <div className="product-card">
            <Link to={`/product-details/${_id}`}>

                <div onClick={() => chooseProduct(props._id)} className="product-card__image">
                    {props.quantity === 0 ?
                        <div  className='product-card__sold-out'>
                            <span>Hết hàng</span>
                        </div>
                        :
                        null
                    }
                    <div  className='product-card__discount'>
                            <span>{(Number(props?.discount - props?.price)/props?.price)*100}%</span>
                        </div>

                    <img src={props.image01} alt="" />
                </div>
                <h3 className="product-card__name">{props.name}</h3>
                <div className="product-card__price">
                    {numberWithCommas(props.discount)}
                    <span className="product-card__price__old">
                        <del>{numberWithCommas(props.price)}</del>
                    </span>
                </div>
            </Link>
            <div className="product-card__btn">
                <Link to={`/product-details/${props._id}`}>
                    <Button
                        onClick={() => chooseProduct(props._id)}
                        size="sm"
                        icon="bx bx-cart"
                        animate={true}
                        quantity = {props.quantity}
                    >
                        chọn mua
                    </Button>
                </Link>
            </div>
        </div>
    )
}

// ProductCard.propTypes = {
//     img01: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     slug: PropTypes.string.isRequired,
// }

export default ProductCard