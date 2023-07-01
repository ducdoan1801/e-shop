import React, { useContext, useEffect, useState } from "react";
import Section, { SectionTitle, SectionBody } from "../../components/Section";
import Grid from "../../components/Grid";
import { ProductContext } from "../../contexts/ProductContext";
import { ImageContext } from "../../contexts/ImageContext";

import ProductCard from "../../components/customer/ProductCard";
import ProductView from "../../components/customer/ProductView";
import Header from "../../components/customer/Header";
import Review from "../../components/customer/Reviews";
import { ReviewContext } from "../../contexts/ReviewContext";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { apiUrl } from "../../contexts/constants";

const ProductDetails = (props) => {
  const { id } = useParams();
  const {
    productState: { product, products },
  } = useContext(ProductContext);
  const {
    imageState: { images },
  } = useContext(ImageContext);
  const {
    ReviewState: { reviews },
  } = useContext(ReviewContext);

 
  const [productTest, setProductTest] = useState(product);
  const [productsTest, setProductsTest] = useState(products);
  const [reviewsTest, setReviewsTest] = useState(reviews);
  const [relatedProducts, setRelatedProducts] = useState(products?.slice(0, 8));
  const [imageTest, setimageTest] = useState(images);

  // const getProducts = (count) => {
  //     const max = products?.length - count
  //     const min = 0
  //     const start = Math.floor(Math.random() * (max - min) + min)
  //     return productsTest?.slice(start, start + count)
  // }
  // const [relatedProducts,setRelatedProducts] = useState(getProducts(8))
  const getAllReview = async () => {
    try {
        const response = await axios.get(`${apiUrl}/review`)
        if (response.data.success) {
            setReviewsTest(response.data?.reviews)
        }
    } catch (error) {
        return error.response.data ? error.response.data : { success: false, message: 'Server error' }
    }
}
  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product`);
      if (response.data.success) {
        setProductsTest(response.data?.products);
        setRelatedProducts(
          response.data?.products?.slice(
            0,
            Math.floor(
              Math.random() * (response.data?.products?.length - 8 - 0) + 8
            )
          )
        );
        // dispatch({ type: 'PRODUCT_LOADED_SUCCESS', payload: response.data.products.reverse() })
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };
  const getProductById = async () => {
    try {
      const response = await axios.get(`${apiUrl}/product/${id}`);
      if (response.data.success) {
        console.log("🚀 ~ file: ProductDetails.jsx:77 ~ getProductById ~ `${apiUrl}/product/${id}`:", `${apiUrl}/product/${id}`)
        console.log("🚀 ~ file: ProductDetails.jsx:77 ~ getProductById ~ response:", response)
        
        setProductTest(response.data?.product);
        setimageTest(response.data?.images);
        // dispatch({ type: 'PRODUCT_LOADED_SUCCESS', payload: response.data.products.reverse() })
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    // setDateReview(
    //   reviews.filter((review) => review?.productId === product?._id)
    // );
    // setReviewsTest(reviews.filter((review) => review?.productId === product?._id))
    getProductById();
    getAllProducts();
    getAllReview()
  }, [id]);
  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAllReview()
  }, []);
  const dataReview = 
    reviewsTest.filter((review) => review?.productId === productTest?._id)
  


  // const relatedProducts = getProducts(8)

  return (
    <>
      <Header />
      <div className="container">
        <div className="main">
          <Section>
            <SectionBody>
              <ProductView images={imageTest} product={productTest} />
              {/* <ProductView images={images} product={product} /> */}
            </SectionBody>
          </Section>
          <Section>
            <Review dataReview={dataReview} />
          </Section>
          <Section>
            <SectionTitle>Khám phá thêm</SectionTitle>
            <SectionBody>
              <Grid col={4} mdCol={2} smCol={1} gap={20}>
                {relatedProducts?.map((item, index) => (
                  <ProductCard
                    key={index}
                    _id={item._id}
                    image01={item.image}
                    quantity={item.quantity}
                    name={item.name}
                    price={Number(item.price)}
                    discount={Number(item.discount)}
                    slug={item.name}
                  />
                ))}
              </Grid>
            </SectionBody>
          </Section>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
