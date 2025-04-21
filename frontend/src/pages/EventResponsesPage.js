import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import "../styles/Responses.css";

const EventResponsesPage = () => {
    const { eventId } = useParams();
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const res = await fetch(`https://campulse.onrender.com/api/events/${eventId}`);
                const data = await res.json();
                setRegistrations(data.registrations);
            } catch (error) {
                console.error('Error fetching registrations:', error);
            }
        };

        fetchRegistrations();
    }, [eventId]);

    const handleDeleteRegistration = async (registrationId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this registration?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`https://campulse.onrender.com/api/events/register/${eventId}/${registrationId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setRegistrations(registrations.filter((reg) => reg._id !== registrationId));
                alert('Registration deleted successfully');
            } else {
                alert('Failed to delete registration');
            }
        } catch (error) {
            console.error('Error deleting registration:', error);
            alert('Error deleting registration');
        }
    };

    const downloadCSV = () => {
        // Prepare the data for CSV
        const csvData = registrations.map((registration) => {
            // Prepare member details as individual columns
            const baseData = {
                TeamName: registration.teamName,
                TeamLeader: registration.teamLeader,
                UTRNumber: registration.utrNumber,
                RegisteredAt: new Date(registration.registeredAt).toLocaleString(),
                PaymentScreenshot: `https://campulse.onrender.com/uploads/${registration.paymentScreenshot}`,
            };

            // Add member details as multiple columns
            const membersData = registration.memberDetails.map((member, index) => ({
                [`MemberName_${index + 1}`]: member.name,
                [`MemberRegNo_${index + 1}`]: member.regNo,
                [`MemberContact_${index + 1}`]: member.contact,
            }));

            return { ...baseData, ...Object.assign({}, ...membersData) };
        });

        // Convert JSON data to CSV using PapaParse
        const csv = Papa.unparse(csvData);

        // Create a Blob and trigger download
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'event_registrations.csv'; // Set filename
        link.click();
    };

    return (
        <div style={{ padding: '30px' }}>
            <div>
                <h3>Registrations for Event</h3>
                {registrations.length === 0 ? (
                    <p>No registrations found.</p>
                ) : (
                    <>
                        <div className='view-response-page'>
                            {registrations.map((registration) => (

                                <div className='response-detail' key={registration._id} >

                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                        <thead>
                                            <tr>
                                                <th className='table-class' >team name</th>
                                                <th className='table-class' >team leader</th>
                                                <th className='table-class' >UTR no.</th>
                                                <th className='table-class' >Registered At:</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td className='table-class' >{registration.teamName}</td>
                                                <td className='table-class' >{registration.teamLeader}</td>
                                                <td className='table-class' >{registration.utrNumber}</td>
                                                <td className='table-class' >{new Date(registration.registeredAt).toLocaleString()}</td>
                                            </tr>
                                        </tbody>

                                    </table>
                                    <h5>Team Members:</h5>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                        <thead>
                                            <tr>
                                                <th className='table-class' >#</th>
                                                <th className='table-class' >Name</th>
                                                <th className='table-class' >Registration Number</th>
                                                <th className='table-class' >Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registration.memberDetails.map((member, index) => (
                                                <tr key={index}>
                                                    <td className='table-class' >{index + 1}</td>
                                                    <td className='table-class' >{member.name}</td>
                                                    <td className='table-class' >{member.regNo}</td>
                                                    <td className='table-class' >{member.contact}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <h5>Payment Screenshot:</h5>
                                    <div className='response-btn'>
                                        {registration.paymentScreenshot && (
                                            <button
                                                onClick={() =>
                                                    window.open(`https://campulse.onrender.com/uploads/${registration.paymentScreenshot}`, "_blank")
                                                }
                                            >
                                                View Screenshot
                                            </button>
                                        )}

                                        <button onClick={() => handleDeleteRegistration(registration._id)} className='response-delete-btn'>Delete Registration </button>
                                    </div>
                                    {/* Add screenshot display here */}
                                    {/* {registration.paymentScreenshot ? (
                                <img
                                    src={`https://campulse.onrender.com/uploads/${registration.paymentScreenshot}`}
                                    alt="Payment Screenshot"
                                    style={{ width: '200px', height: 'auto' }}
                                />
                            ) : (
                                <p>No payment screenshot uploaded</p>
                            )}  */}









                                    {/* <h4>Team Name: {registration.teamName}</h4>
                            <p><strong>Team Leader:</strong> {registration.teamLeader}</p>
                            <p><strong>UTR Number:</strong> {registration.utrNumber}</p>
                            <p><strong>Registered At:</strong> {new Date(registration.registeredAt).toLocaleString()}</p>

                            <h5>Team Members:</h5>
                            <ul>
                                {registration.memberDetails.map((member, index) => (
                                    <li key={index}>
                                        <p><strong>Name:</strong> {member.name}</p>
                                        <p><strong>Registration Number:</strong> {member.regNo}</p>
                                        <p><strong>Contact:</strong> {member.contact}</p>
                                    </li>
                                ))}
                            </ul> */}


                                </div>


                            ))}
                        </div>
                        <button onClick={downloadCSV} className='csv-btn'>
                            Download as CSV
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventResponsesPage;











// {registration.paymentScreenshot ? (
//                                 <img
//                                     src={`https://campulse.onrender.com/uploads/${registration.paymentScreenshot}`}
//                                     alt="Payment Screenshot"
//                                     style={{ width: '200px', height: 'auto' }}
//                                 />
//                             ) : (
//                                 <p>No payment screenshot uploaded</p>
//                             )}



// <div>
// <h4>Team Name: {registration.teamName}</h4>
// <p><strong>Team Leader:</strong> {registration.teamLeader}</p>
// <p><strong>UTR Number:</strong> {registration.utrNumber}</p>
// <p><strong>Registered At:</strong> {new Date(registration.registeredAt).toLocaleString()}</p>


