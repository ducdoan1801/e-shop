import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'

const SignUp = () => {

    const { registerUser } = useContext(AuthContext)
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    })

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // const history = useHistory()

    const { username, password, confirmPassword, email } = registerForm

    const onChangeRegisterForm = event => setRegisterForm({ ...registerForm, [event.target.name]: event.target.value })

    const register = async event => {
        event.preventDefault()

        if (password !== confirmPassword) {
            toast.error('🦄 Nhập mật khẩu không chính xác!');
            return
        }

        try {
            const registerData = await registerUser(registerForm)
            if (!registerData.success) {
                toast.error('🦄 Đăng ký không thành công!');
            }
        } catch (error) {
            console.log(error)

        }
    }


    return (
        <div >
            <form onSubmit={register} >
                <div >
                    <label  >Tên tài khoản</label>
                    <Input name='username' placeholder="Nhập tên tài khoản"
                        value={username}
                        onChange={onChangeRegisterForm}
                    />
                </div>
                <br />
                <div >
                    <label  >Mật khẩu</label>
                    <Input.Password
                        placeholder="Nhập mật khẩu"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        name='password'
                        value={password}
                        onChange={onChangeRegisterForm}
                    />
                </div>
                <br />
                <div >
                    <label  >Nhập lại mật khẩu</label>
                    <Input.Password
                        placeholder="Nhập lại mật khẩu"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={onChangeRegisterForm}
                    />
                </div>
                <br />
                <div >
                    <label  >Địa chỉ Email</label>
                    <Input type="email" name='email' placeholder="Nhập tên tài khoản"
                        value={email}
                        onChange={onChangeRegisterForm}
                    />
                </div>
                <br />
                <div >
                    <button type="submit" className='btn-login'><span style={{ marginRight: 20, marginLeft: 20 }}>Đăng ký</span></button>
                </div>
                <div />
                <br />
                <br />
                <div>
                    <Link to='/login'>Bạn đã sẵn sàng để đăng nhập?
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default SignUp

