import React, { useEffect, useState } from 'react'
import './componies.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { MdOutlineArrowBack } from "react-icons/md";

function Companies() {

    const [owner, setOwner] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');
    const [select, setSelect] = useState('');
    const [userType, setUserType] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            const res = (JSON.parse(Cookies.get('LoggedInUser')));
            setUserType(res.userType);
            console.log('usertypecompnay', res.userType);
        }
        fetchData();
    }, []);
    useEffect(() => {
        const fetchCompany = async () => {
            const cookieData = Cookies.get('compnaies');
            if (cookieData) {
                try {
                    const res = JSON.parse(cookieData);
                    setCompanyData(res);
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                }
            } else {
                console.log('Cookie "compnaies" not found.');
            }
        };

        fetchCompany();
    }, []);

    const handleSubmit = () => {

        let existingComnay = [];
        try {
            existingComnay = JSON.parse(Cookies.get('compnaies')) || []
        } catch (err) {
            console.error("data is not existing  ", err)
        }
        const id = uuidv4();
        const data = { id, company, owner };

        const newCompany = [...existingComnay, data];
        Cookies.set('compnaies', JSON.stringify(newCompany), { expires: 30 })

        Cookies.set(id, JSON.stringify(data), { expires: 30 });

        setMessage('Company created!');
        setTimeout(() => {
            setMessage('')
        }, 3000);

        setOwner('');
        setCompany('');
    }

    const handleAccountClick = (company) => {

        setMessage("Welcome to Account page")
        setTimeout(() => {
            setMessage('')
        }, 4000);

        Cookies.set('selectedCompany', JSON.stringify(company), { expires: 30 })

        if (userType === 'Admin' || userType === 'User') {
            navigate('/account');
        }
        const logionUser =JSON.parse(Cookies.get('LoggedInUser'));
        const selectedCompany =JSON.parse (Cookies.get('selectedCompany'));
        console.log('ownersCompany', logionUser)
        console.log('ownersCompanyowner:', selectedCompany)

        if (userType === 'Owner') {
            if (selectedCompany.owner === logionUser.email) {
                navigate('/account');
            } else {
                setMessage('Error: this is not your company');
            }
        }

    }


    const handleNavigate = () => {
        navigate("/login")
    }
    return (
        <div className='company' >

            {message && <p className={`message  ${message.startsWith("Error:") ? "error" : ""}`}>{message}</p>}
            <MdOutlineArrowBack className='icon' style={{ fontSize: "large", marginRight: '97%', cursor: "pointer" }} onClick={handleNavigate} />
            {userType === 'Admin' && (

                <div>
                    <h2>Create Companies</h2>
                    <form onSubmit={handleSubmit} >
                        <lable>Owner's Email:</lable>
                        <input className='com-input' type='text' placeholder="Enter Owner's email" value={owner} onChange={(e) => setOwner(e.target.value)} required />
                        <lable>Company Name:</lable>
                        <input className='com-input' type='text' placeholder="Enter company name" value={company} onChange={(e) => setCompany(e.target.value)} required />
                        <button type="submit" className="com-button">Create</button>

                        <h2>{userType}'s Companies</h2>
                        <table className='styled-table' >
                            <thead>
                                <tr>
                                    <th> </th>
                                    <th>Owner's Email</th>
                                    <th>Company Name</th>
                                    <th> </th>
                                    <th> </th>
                                </tr>

                            </thead>

                            <tbody>
                                {companyData.length === 0 ? (
                                    <p> There is no Company </p>
                                ) : (

                                    companyData.map((company) => (
                                        <tr key={company.id} >
                                            <td>
                                                <input
                                                    checked={select.includes(company.id)}
                                                    onChange={(e) => setSelect(e.target.checked ? [...select, company.id] : select.filter(id => id !== company.id))}
                                                    type="checkbox"
                                                />
                                            </td>
                                            <td>{company.owner}</td>
                                            <td>{company.company}</td>
                                            <td><button type='button' onClick={() => handleAccountClick(company)} className="click-button" style={{ marginTop: "10px" }} >Account</button></td>
                                           

                                        </tr>
                                    ))
                                )}



                            </tbody>
                        </table>
                    </form>

                </div>
            )}

            {
                userType === 'Owner' && (
                    <div>
                        <h2>{userType}'s Company</h2>
                        <table className='styled-table' >
                            <thead>
                                <tr>
                                    <th> </th>
                                    <th>Owner's Email</th>
                                    <th>Company Name</th>
                                    <th> </th>
                                    <th> </th>
                                </tr>

                            </thead>

                            <tbody>
                                {companyData.length === 0 ? (
                                    <p> There is no Company </p>
                                ) : (

                                    companyData.map((company) => (
                                        <tr key={company.id} >
                                            <td>
                                                <input checked={select} onChange={(e) => setSelect(e.target.value)} type='checkbox' />
                                            </td>
                                            <td>{company.owner}</td>
                                            <td>{company.company}</td>
                                            <td><button type='button' onClick={() => handleAccountClick(company)} className="click-button" style={{ marginTop: "10px" }} >Account</button></td>

                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </table>

                    </div>
                )
            }

            {userType === 'User' && (
                <div>
                    <h2>{userType}'s Companies</h2>
                    <table className='styled-table' >
                        <thead>
                            <tr>
                                <th> </th>
                                <th>Owner's Email</th>
                                <th>Company Name</th>
                                <th> </th>
                                <th> </th>
                            </tr>

                        </thead>

                        <tbody>
                            {companyData.length === 0 ? (
                                <p style={{ width: '50%', fontFamily: 'bold' }} > There is no Company </p>
                            ) : (

                                companyData.map((company) => (
                                    <tr key={company.id} >
                                        <td>
                                            <input checked={select} onChange={(e) => setSelect(e.target.value)} type='checkbox' />
                                        </td>
                                        <td>{company.owner}</td>
                                        <td>{company.company}</td>
                                        <td><button type='button'  onClick={() => handleAccountClick(company)} className="click-button" style={{ marginTop: "10px" }} >Account</button></td>

                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>
            )}

        </div>
    )
}

export default Companies;
