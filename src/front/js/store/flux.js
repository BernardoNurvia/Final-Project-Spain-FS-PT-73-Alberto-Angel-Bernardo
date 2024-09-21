const getState = ({ getStore, getActions, setStore }) => {

	const savedState = JSON.parse(localStorage.getItem('appState')) || {};

	return {
		store: {
			selectedSalon: null,
			selectedProfessional: savedState.selectedProfessional || null, 
			selectedService: savedState.selectedService || null, 
			//fetch employee
			professional: [],
			customer: [],
			services: [],
			selectedDate: savedState.selectDate || "",
			selectedTime: savedState.selectedTime || "",
			selectCustomer: savedState.selectCustomer || "",
			messageAppointment: "",
			token: localStorage.getItem('jwt_token') || null, 
            auth: !!localStorage.getItem('jwt_token'), 

		},
		actions: {
			setToken: (token) => {
                if (token) {
                    localStorage.setItem('jwt_token', token);
                    setStore({
                        token: token,
                        auth: true,
                    });
                } else {
                    localStorage.removeItem('jwt_token');
                    setStore({
                        token: null,
                        auth: false,
                    });
                }
            },
			// Cerrar sesión
            logout: () => {
                localStorage.removeItem('jwt_token');
                setStore({
                    token: null,
                    auth: false,
                    selectCustomer: null, 
                });
                console.log("Usuario desconectado");
            },

			selectSalon: (salon) => {
				setStore({ selectedSalon: salon });
			},
			selectProfessional: (professional) => {
				const store = getStore();
				setStore({ ...store, selectedProfessional: professional });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			selectService: (service) => { 
				const store = getStore();
				setStore({ ...store, selectedService: service });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			//fetch date appointment
			selectDate: (date) => {
				const store = getStore();
				setStore({ ...store, selectedDate: date });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			//fetch time appointment
			selectTime: (time) => {
				const store = getStore();
				setStore({ ...store, selectedTime: time });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			selectCustomer: (customer) => {
				const store = getStore();
				setStore({ ...store, selectCustomer: customer });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},

			//fetch Employee
			getProfessional: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/employees")
					const data = await resp.json()
					setStore({ professional: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			//fetch Customer Bernardo
			getCustomer: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customers")
					const data = await resp.json()
					setStore({ customer: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
		
			//fetch Services
			getServices: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/services")
					const data = await resp.json()
					setStore({ services: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			//fetch appointment
			postAppointment: async () => {
				const store = getStore()
				console.log(store.selectCustomer);
				

				try {
					const appointmentData = {
						order_date: new Date().toISOString(),
						appointment_time: store.selectedTime,
						customer_id: store.selectCustomer, // Debo ser el ID del cliente logueado
						employee_id: store.selectedProfessional.id,
						service_id: store.selectedService.id,
						appointment_state_id: true,
						appointment_date: store.selectedDate
						
					}
					console.log('Datos de la cita:', appointmentData);
					const resp = await fetch(process.env.BACKEND_URL + "/api/new_appointment", {
						method: "POST",
						body: JSON.stringify(appointmentData),
						headers: { "Content-Type": "application/json" }

					})
					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'error al reservar cita');
					}

					const data = await resp.json()
					console.log('Reserva exitosa', data)
					return data;
				} catch (error) {
					console.log("Error en registrar la reserva:'", error)
					throw error;
				}

			},
			//fetch signupCustomer
			postSignupCustomer: async (customerData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customer_register", {
						method: "POST",
						body: JSON.stringify(customerData),
						headers: { "Content-Type": "application/json" }

					})
					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'error al registrar el usuario');
					}

					const data = await resp.json()
					console.log('Registro exitoso', data)
					if (data.jwt_token) {
					
						getActions().setToken(data.jwt_token);
					}
			
					// Almacenar el customer_id en selectCustomer
					setStore({ selectCustomer: data.customer_id });
			
					// Guardar el estado actualizado en localStorage
					localStorage.setItem('appState', JSON.stringify(getStore()));
			
					console.log('Customer ID almacenado:', data.customer_id);
					return data;
				} catch (error) {
					console.log("Error en el registro:'", error)
					throw error;
				}
			},
			//fetch PasswordResetRequest
			postPasswordResetRequest: async (email) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/request_password_reset', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email })
					});


					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.msg || 'Error enviando solicitud de restablecimiento de contraseña');
					}

					alert('Se ha enviado un enlace de restablecimiento de contraseña a tu email');
				} catch (error) {
					console.error('Error:', error);
					alert('Hubo un error al enviar la solicitud');
				}
			},
			//fetch PasswordReset
			PasswordReset: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/reset_password', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` 
						},
						body: JSON.stringify({ new_password: newPassword })
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.msg || 'Error restableciendo la contraseña');
					}

					alert('¡Tu contraseña ha sido restablecida!');
				} catch (error) {
					console.error('Error:', error);
					alert('Hubo un error al restablecer la contraseña');
				}
			},
			//fetch messageAppointmentCustomer
			messageAppointmentCustomer: (message) => {
				const store = getStore();
				setStore({ ...store, messageAppointment: message });
				localStorage.setItem('appState', JSON.stringify(getStore()));

			},
			//fetch login customer
			loginCustomer: async (form) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify(form),
                    });

                    if (!resp.ok) {
                        const errorData = await resp.json();
                        throw new Error(errorData.msg || 'Error al autenticar usuario');
                    }

                    const data = await resp.json();
                   
                    if (data.jwt_token) {
                        getActions().setToken(data.jwt_token); 
                        setStore({ selectCustomer: data.customer_id });
                        console.log('Inicio de sesión exitoso');
                        return true; // Retornar éxito
                    }

                    return false;
                } catch (error) {
                    console.error('Error:', error);
                    return false;
                }
            },
			getCustomerId: async () => {
                const store = getStore();
                const token = store.token; 
                if (!token) {
                    console.log("No se ha encontrado un token.");
                    return;
                }

                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/get_customer_id", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` 
                        }
                    });

                    if (!resp.ok) {
                        throw new Error("Error al obtener el customer_id");
                    }

                    const data = await resp.json();
                    setStore({ selectCustomer: data.customer_id });
                    console.log("Customer ID obtenido", data);
                } catch (error) {
                    console.error("Error:", error);
                }
            },
		}
	};
};

export default getState;
