import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Spin } from 'antd';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { SliderContext } from "../../../contexts/SliderContext";
import { toast } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router'


const AddSlider = () => {
    const { addSlider } = useContext(SliderContext)
    const [newSlider, setNewSlider] = useState({
        title: "",
        color: "red",
        description: "",
        image: ""
    });
    const [previewImage, setPreviewImage] = useState()
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsloading] = useState(false)
    const [mainPreviewImage, setMainPreviewImage] = useState("")


    useEffect(() => {
        return () => {
            previewImage && URL.revokeObjectURL(previewImage)
        }
    }, [previewImage])


    const onChangeNewProduct = (name) => (e) => {
        const value = name === "image" ? e.target.files[0] : e.target.value;
        if (name === "image") {
            handlePreview(e)
        }
        setNewSlider({ ...newSlider, [name]: value });
    };


    const { TextArea } = Input;
    const history = useHistory()



    const openPreviewImage = (url) => {
        if (!url) return;
        setPreviewImage(url)
        setIsOpen(true)
    }

    const handlePreview = (e) => {
        let file = URL.createObjectURL(e.target.files[0])
        setMainPreviewImage(file)
    }

    useEffect(() => {
        return () => {
            mainPreviewImage && URL.revokeObjectURL(mainPreviewImage)
        }
    }, [mainPreviewImage])


    const onSubmitProduct = async event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append("image", newSlider.image);
        formData.append("title", newSlider.title);
        formData.append("description", newSlider.description);
        formData.append("color", newSlider.color);
        setIsloading(true)
        const { success } = await addSlider(formData)
        if (success) {
            resetAddData()
            toast.success('🦄 Thêm thành công!');
            history.push('/admin/slider')
        }
        else {
            toast.error('🦄 Lỗi');
        }
    }

    const resetAddData = () => {
        setNewSlider({
            title: "",
            color: "",
            description: "",
            image: ""
        })
        setPreviewImage()
        setIsloading(false)
    }


    return (
        <> <div >
            {isLoading && <div><Spin /></div>}
            <form onSubmit={onSubmitProduct} style={{ position: 'relative', marginBottom: 30 }} >

                <div className="form__group field">
                    <input type="input" className="form__field" placeholder="Tên" name="title" id='title' value={newSlider.title} onChange={onChangeNewProduct("title")} required />
                    <label htmlFor="title" className="form__label">Tên </label>
                </div>
                <br />
                <br />
                <div className="form__group field">
                    <label className="form__label">Màu </label>

                    <select style={{ width: '70%' }} onChange={onChangeNewProduct('color')}
                        className="form-select"
                        value={newSlider.color}
                        aria-label="Default select example">
                        <option value='red'>red</option>
                        <option value='blue'>blue</option>
                        <option value='pink'>pink</option>
                        <option value='orange'>orange</option>
                    </select>
                </div>
                <br />

                <TextArea name='description' value={newSlider.description} onChange={onChangeNewProduct("description")} rows={4} placeholder="Nội dung miêu tả" />
                <br />
                <div>
                    <label className='lable-upload box_Shadow' id='lable' htmlFor='image' >
                        <span style={{ padding: 20 }}><UploadOutlined style={{ fontSize: '25px' }} /> Tải ảnh lên</span>
                    </label>
                    <input
                        id="image"
                        className="form-control"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={onChangeNewProduct("image")}
                        onClick={(event) => {
                            event.target.value = null
                        }}
                    />
                </div>
                {
                    mainPreviewImage && (<img src={mainPreviewImage} onClick={() => openPreviewImage(mainPreviewImage)} alt="" width="20%" height="10%" />)
                }
                <br />

                <Button style={{ position: 'absolute', Button: 0, right: 0 }} type='primary' htmlType='submit'>Thêm</Button>
            </form>
        </div>

            {
                isOpen === true &&
                <Lightbox
                    mainSrc={previewImage}
                    onCloseRequest={() => setIsOpen(false)}
                />
            }
        </>
    );
};

export default AddSlider
    ;