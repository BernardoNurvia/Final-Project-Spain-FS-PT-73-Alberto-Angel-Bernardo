import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Link, useParams } from "react-router-dom";
import BookAppointment_Proffesional from '../component/BookAppointment_Proffesional';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

import CustomerCard from '../component/CustomerCard';
import BookAppointment from '../component/BookAppointment';

const DashboardCustomer = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("tab1");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("jwt_token")) {

            actions.getCustomer();
        } else {
            navigate("/login");
        }
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='container'>
            <h1 className='mt-3'>Dashboard</h1>
            <CustomerCard />
            <div className='container'>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Employee Id</th>
                            <th scope="col">Role</th>
                            <th scope="col">Status</th>
                            <th scope="col">Appointment</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.professional.map((professional, index) => (
                            <tr key={index}>
                                <th scope="row"><input type="checkbox" /></th>
                                <td>{professional.name}</td>
                                <td>{professional.id}</td>
                                <td>{professional.role}</td>
                                <td>{professional.status}</td>
                                <td>{professional.appointment}</td>
                                <td>
                                    <Link to=""><button className="btn"><i className="bi bi-pencil-square"></i></button></Link>
                                </td>
                                <td>
                                    <button className="btn"><i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="container d-flex justify-content-evenly">
                <button className='m-auto btn btn-warning fw-bold' type='submit'>Register Employee</button>
                <button className='m-auto btn btn-warning fw-bold' type='submit'>Register Customer</button>
            </div>
        </div >
    );
};

export default DashboardCustomer;