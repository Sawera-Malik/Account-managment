import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack } from "react-icons/md";
import "./accounts.css";

function Accounts() {
	const [selected, setSelected] = useState([]);
	const [editIndex, setEditIndex] = useState(null);
	const [userdata, setUserData] = useState([]);
	const [editedUser, setEditedUser] = useState({});
	const [usertype, setUserType] = useState([]);
	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchCompnay = async () => {
			const res = await JSON.parse(Cookies.get("selectedCompany"));
			console.log("selectedcompany", res);
			setSelected(res);
		};
		fetchCompnay();
	}, []);

	useEffect(() => {
		const fetchUser = async () => {
			const res = Cookies.get("ComapnyUserData")
				? JSON.parse(Cookies.get("ComapnyUserData"))
				: {};
			if (selected?.id) {
				setUserData(res[selected.id] || []);
			}
		};
		fetchUser();
	}, [selected]);

	useEffect(() => {
		const fetchData = () => {
			const res = JSON.parse(Cookies.get("LoggedInUser"));
			setUserType(res.userType);
			console.log("usertypecompnay", res.userType);
		};
		fetchData();
	}, []);

	const handleDelete = (id) => {
		const allCompanyUsers = JSON.parse(Cookies.get("ComapnyUserData") || "{}");

		if (!allCompanyUsers[selected.id]) {
			setMessage("Error: No users found for this company.");
			return;
		}

		const updatedUsers = allCompanyUsers[selected.id].filter(
			(user) => user.id !== id,
		);

		allCompanyUsers[selected.id] = updatedUsers;
		Cookies.set("ComapnyUserData", JSON.stringify(allCompanyUsers), {
			expires: 30,
		});

		setUserData(updatedUsers);

		setMessage("User Data Deleted!");
		setTimeout(() => {
			setMessage("");
		}, 3000);
	};

	const handleEdit = (index) => {
		const userToEdit = userdata[index];
		setEditIndex(index);
		setEditedUser(userToEdit);
	};
	const handleSave = () => {
		const updatedUserData = [...userdata];
		updatedUserData[editIndex] = editedUser;
		setUserData(updatedUserData);

		const allCompanyUsers = JSON.parse(Cookies.get("ComapnyUserData") || "{}");
		allCompanyUsers[selected.id] = updatedUserData;
		Cookies.set("ComapnyUserData", JSON.stringify(allCompanyUsers), {
			expires: 30,
		});

		setEditIndex(null);
		setMessage("User Data Updated!");
		setTimeout(() => {
			setMessage("");
		}, 3000);
	};


	const handleApproval = (id, isApproved) => {
		const updatedData = userdata.map((user) =>
			user.id === id
				? { ...user, status: isApproved ? "Approved" : "Rejected" }
				: user,
		);
		setUserData(updatedData);

		const allCompanyData = JSON.parse(Cookies.get("ComapnyUserData") || "{}");
		allCompanyData[selected.id] = updatedData;
		Cookies.set("ComapnyUserData", JSON.stringify(allCompanyData), {
			expires: 30,
		});

		setMessage(`Account ${isApproved ? "approved" : "rejected"} successfully!`);
		setTimeout(() => setMessage(""), 3000);
	};

	const handleNavigate = () => navigate("/company");
	const handleAccount = () => navigate("/add");

	return (
		<div className="account-page">
			{message && (
				<p
					className={`message ${message.startsWith("Error:") ? "error" : "success"}`}
				>
					{message}
				</p>
			)}
			<MdOutlineArrowBack
				style={{ fontSize: "large", marginRight: "97%", cursor: "pointer" }}
				onClick={handleNavigate}
			/>
			{selected.id ? (
				<div>
					<h1 className="account-title">Account Page of {selected.company}</h1>
					{usertype === "Admin" && (
						<div>
							<div className="create">
								<div className="task-container">
									<h1 className="heading">Task Management App</h1>
									<table className="task-table">
										<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th>Password</th>
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{userdata.length === 0 ? (
												<tr>
													<td colSpan="5">No User Available</td>
												</tr>
											) : (
												userdata.map((user, index) => (
													<tr key={user.id}>
														<td>{user.username}</td>
														<td>{user.email}</td>
														<td>{user.role}</td>

														<td>{user.status || "Pending"}</td>
														<td>
															<button type="button"
																className="action-btn approve-btn"
																onClick={() => handleApproval(user.id, true)}
															>
																Approve
															</button>
															<button type="button"
																className="action-btn reject-btn"
																onClick={() => handleApproval(user.id, false)}
															>
																Reject
															</button>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}
					{usertype === "Owner" && (
						<div>
							<button type="button" className="account-btn" onClick={() => handleAccount()}>
								Add Account
							</button>

							<div className="create">
								<div className="task-container">
									<h1 className="heading">Task Management App</h1>
									<table className="task-table">
										<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th>Password</th>
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{userdata.length === 0 ? (
												<p> No User Available </p>
											) : (
												userdata.map((user, index) => (
													<tr key={user.id}>
														<td>
															{editIndex === index ? (
																<input
																	type="text"
																	value={editedUser.username}
																	onChange={(e) =>
																		setEditedUser({
																			...editedUser,
																			username: e.target.value,
																		})
																	}
																/>
															) : (
																user.username
															)}
														</td>
														<td>
															{" "}
															{editIndex === index ? (
																<input
																	type="email"
																	value={editedUser.email}
																	onChange={(e) =>
																		setEditedUser({
																			...editedUser,
																			email: e.target.value,
																		})
																	}
																/>
															) : (
																user.email
															)}
														</td>
														<td>
															{" "}
															{editIndex === index ? (
																<input
																	type="text"
																	value={editedUser.role}
																	onChange={(e) =>
																		setEditedUser({
																			...editedUser,
																			role: e.target.value,
																		})
																	}
																/>
															) : (
																user.role
															)}
														</td>

														<td>{user.status || "Pending"}</td>
														<td className="action-button">
															{editIndex === index ? (
																<button type="button"
																	className="action-btn edit-btn"
																	onClick={handleSave}
																>
																	Save
																</button>
															) : (
																<button type="button"
																	className="action-btn edit-btn"
																	onClick={() => handleEdit(index)}
																>
																	Edit
																</button>
															)}
															<button  type="button" className="action-btn del-btn"onClick={() => handleDelete(user.id)}>Delete</button>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}
					{usertype === "User" &&
						userdata.some((user) => user.status === "Approved") && (
							<div>
								<div className="create">
									<div className="task-container">
										<h1 className="heading">Task Management App</h1>
										<table className="task-table">
											<thead>
												<tr>
													<th>Name</th>
													<th>Email</th>
													<th>Role</th>
												</tr>
											</thead>
											<tbody>
												{userdata.length === 0 ? (
													<p> No User Available </p>
												) : (
													userdata
														.filter((user) => user.status === "Approved")
														.map((user) => (
															<tr key={user.id}>
																<td>{user.username}</td>
																<td>{user.email}</td>
																<td>{user.role}</td>
															</tr>
														))
												)}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						)}
				</div>
			) : (
				<p>No company</p>
			)}
		</div>
	);
}

export default Accounts;

// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';
// import { MdOutlineArrowBack } from "react-icons/md";
// import './accounts.css';

// function Accounts() {
//   const [selected, setSelected] = useState(null);
//   const [editIndex, setEditIndex] = useState(null);
//   const [userdata, setUserData] = useState([]);
//   const [editedUser, setEditedUser] = useState({});
//   const [usertype, setUserType] = useState('');
//   const [message, setMessage] = useState('');

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCompany = async () => {
//       const res = JSON.parse(Cookies.get('selectedCompany') || '{}');
//       setSelected(res);
//     };
//     fetchCompany();
//   }, []);

//   useEffect(() => {
//     const fetchUser = () => {
//       const res = Cookies.get("ComapnyUserData") ? JSON.parse(Cookies.get("ComapnyUserData")) : {};
//       if (selected?.id) {
//         setUserData(res[selected.id] || []);
//       }
//     };
//     fetchUser();
//   }, [selected]);

//   useEffect(() => {
//     const fetchUserType = () => {
//       const res = JSON.parse(Cookies.get('LoggedInUser') || '{}');
//       setUserType(res.userType || '');
//     };
//     fetchUserType();
//   }, []);

//   const handleDelete = (id) => {
//     const allCompanyUsers = JSON.parse(Cookies.get('ComapnyUserData') || '{}');
//     if (!allCompanyUsers[selected.id]) {
//       setMessage('Error: No users found for this company.');
//       return;
//     }

//     const updatedUsers = allCompanyUsers[selected.id].filter(user => user.id !== id);
//     allCompanyUsers[selected.id] = updatedUsers;
//     Cookies.set('ComapnyUserData', JSON.stringify(allCompanyUsers), { expires: 30 });
//     setUserData(updatedUsers);

//     setMessage('User Data Deleted!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   const handleEdit = (index) => {
//     setEditIndex(index);
//     setEditedUser(userdata[index]);
//   };

//   const handleSave = () => {
//     const updatedUserData = [...userdata];
//     updatedUserData[editIndex] = editedUser;

//     setUserData(updatedUserData);

//     const allCompanyUsers = JSON.parse(Cookies.get('ComapnyUserData') || '{}');
//     allCompanyUsers[selected.id] = updatedUserData;
//     Cookies.set('ComapnyUserData', JSON.stringify(allCompanyUsers), { expires: 30 });

//     setEditIndex(null);
//     setMessage('User Data Updated!');
//     setTimeout(() => setMessage(''), 3000);
//   };

//   const handleApproval = (id, isApproved) => {
//     const updatedData = userdata.map(user =>
//       user.id === id ? { ...user, status: isApproved ? 'Approved' : 'Rejected' } : user
//     );
//     setUserData(updatedData);

//     const allCompanyData = JSON.parse(Cookies.get('ComapnyUserData') || '{}');
//     allCompanyData[selected.id] = updatedData;
//     Cookies.set('ComapnyUserData', JSON.stringify(allCompanyData), { expires: 30 });

//     setMessage(`Account ${isApproved ? 'approved' : 'rejected'} successfully!`);
//     setTimeout(() => setMessage(''), 3000);
//   };

//   const handleNavigate = () => navigate('/company');
//   const handleAccount = () => navigate('/add');

//   return (
//     <div className="account-page">
//       {message && (
//         <p className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>
//           {message}
//         </p>
//       )}
//       <MdOutlineArrowBack style={{ fontSize: "large", marginRight: '97%', cursor: "pointer" }} onClick={handleNavigate} />
//       {selected?.id ? (
//         <div>
//           <h1 className="account-title">Account Page of {selected.company}</h1>
//           <div className="create">
//             <div className="task-container">
//               <h1 className="heading">Task Management App</h1>
//               <table className="task-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {userdata.length === 0 ? (
//                     <tr><td colSpan="5">No User Available</td></tr>
//                   ) : (
//                     userdata.map((user, index) => (
//                       <tr key={user.id}>
//                         <td>
//                           {editIndex === index ? (
//                             <input
//                               type="text"
//                               value={editedUser.username}
//                               onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
//                             />
//                           ) : (
//                             user.username
//                           )}
//                         </td>
//                         <td>
//                           {editIndex === index ? (
//                             <input
//                               type="email"
//                               value={editedUser.email}
//                               onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
//                             />
//                           ) : (
//                             user.email
//                           )}
//                         </td>
//                         <td>
//                           {editIndex === index ? (
//                             <input
//                               type="text"
//                               value={editedUser.role}
//                               onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
//                             />
//                           ) : (
//                             user.role
//                           )}
//                         </td>
//                         <td>{user.status || 'Pending'}</td>
//                         <td>
//                           {editIndex === index ? (
//                             <button className="action-btn edit-btn" onClick={handleSave}>Save</button>
//                           ) : (
//                             <button className="action-btn edit-btn" onClick={() => handleEdit(index)}>Edit</button>
//                           )}
//                           <button className="action-btn del-btn" onClick={() => handleDelete(user.id)}>Delete</button>
//                           <button className="action-btn approve-btn" onClick={() => handleApproval(user.id, true)}>Approve</button>
//                           <button className="action-btn reject-btn" onClick={() => handleApproval(user.id, false)}>Reject</button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p>No company selected.</p>
//       )}
//     </div>
//   );
// }

// export default Accounts;
